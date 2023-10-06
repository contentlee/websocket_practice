import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil";
import { Socket } from "socket.io-client";

import CamOnIcon from "@assets/videocam_on_icon.svg";
import CamOffIcon from "@assets/videocam_off_icon.svg";
import AudioOnIcon from "@assets/mic_on_icon.svg";
import AudioOffIcon from "@assets/mic_off_icon.svg";

import { userAtom } from "@atoms/userAtom";

import { Button, Icon } from "@components";

import Select from "../components/Select";
import { alertAtom } from "@atoms/stateAtom";

import { useAnimate } from "@hooks";

const VideoContainer = () => {
  const navigate = useNavigate();

  const [animation, setAnimation] = useAnimate();

  // common/AlarmContainer
  const { socket } = useOutletContext<{ socket: Socket }>();
  // room name
  const { name } = useParams();

  // user(me) information
  const userInfo = useRecoilValue(userAtom);

  // common UI
  const [_, setAlert] = useRecoilState(alertAtom);

  // Video Stream
  const videoRef = useRef<HTMLVideoElement>(null);

  const [stream, setStream] = useState<MediaStream>();

  const [onCam, setOnCam] = useState(false);
  const [onAudio, setOnAudio] = useState(false);

  const [selectedCam, setSelectedCam] = useState<MediaStreamTrack>();
  const [selectedAudio, setSelectedAudio] = useState<MediaStreamTrack>();

  const [audioList, setAudioList] = useState<MediaDeviceInfo[]>([]);
  const [camList, setCamList] = useState<MediaDeviceInfo[]>([]);

  // select Cam
  const handleChangeCam = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value;
    const mediaStream = await getMedia(selectedAudio!.id, value);
    if (videoRef.current) videoRef.current.srcObject = mediaStream;
    setStream(mediaStream);
  };

  // select Audio
  const handleChangeAudio = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value;
    const mediaStream = await getMedia(value, selectedCam!.id);
    if (videoRef.current) videoRef.current.srcObject = mediaStream;
    setStream(mediaStream);
  };

  // visibel or invisible
  const handleClickCamToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setOnCam(track.enabled);
    });
  };

  // mute or unmute
  const handleClickAudioToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setOnAudio(track.enabled);
    });
  };

  // create stream
  const getMedia = (audio = "", video = "") => {
    const constrains = {
      audio: audio !== "" ? { deviceId: audio } : true,
      video: video !== "" ? { deviceId: video } : true,
    };
    return navigator.mediaDevices.getUserMedia(constrains);
  };

  // find all devices
  const getDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return {
      cam: devices.filter((device) => device.kind === "videoinput"),
      audio: devices.filter((device) => device.kind === "audioinput"),
    };
  };

  // Connection
  const [callState, setCallState] = useState("waiting");

  const peerConnection = useRef<RTCPeerConnection>();

  // return page
  const handleClickExit = (e: React.MouseEvent) => {
    e.preventDefault();
    setAnimation({
      type: "fadeOut",
      callback: () => {
        navigate(-1);
      },
    });
  };

  useEffect(() => {
    // video init
    const videoInit = async () => {
      try {
        const mediaStream = await getMedia();
        const { cam, audio } = await getDevices();

        if (videoRef.current) videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCamList(cam);
        setAudioList(audio);
        setSelectedAudio(mediaStream.getAudioTracks()[0]);
        setSelectedCam(mediaStream.getVideoTracks()[0]);
        setOnCam(true);
        setOnAudio(true);
      } catch (err) {
        console.log(err);
      }
    };
    videoInit();

    // connection init
    const handleIcecandidate = (data: RTCPeerConnectionIceEvent) => {
      socket.emit("icecandidate", data.candidate);
    };

    const connection = new RTCPeerConnection();
    connection.addEventListener("icecandidate", handleIcecandidate);
    connection.ontrack = (e) => {
      console.log(e);
    };
    stream?.getTracks().forEach((track) => connection.addTrack(track, stream));

    peerConnection.current = connection;

    // connecting
    const cancelCall = () => {
      socket.emit("end_call", userInfo.name);
      setAnimation({
        type: "fadeOut",
        callback: () => {
          navigate(-1);
        },
      });
    };

    const permitCall = async () => {
      const offer = await peerConnection.current?.createOffer();
      // send your offer (2)
      socket.emit("offer", name, offer, () => {
        setAlert({ isOpened: true, type: "success", children: "상대방과의 연결을 시작합니다." });
      });
    };

    const receiveOffer = async (offer: RTCSessionDescriptionInit) => {
      peerConnection.current?.setRemoteDescription(offer);
      const answer = await peerConnection.current?.createAnswer();
      peerConnection.current?.setLocalDescription(answer);
      // send my answer (this name is roomname) (4)
      socket.emit("answer", name, answer, () => {
        setCallState("connect");
      });
    };

    const receiveAnswer = async (answer: RTCSessionDescriptionInit) => {
      await peerConnection.current?.setRemoteDescription(answer);
    };

    const icecandidate = async (ice: RTCIceCandidateInit) => {
      await peerConnection.current?.addIceCandidate(ice);
    };

    const endCall = () => {
      setAlert({ isOpened: true, type: "warning", children: "상대방이 통화를 종료하였습니다." });
      setAnimation({
        type: "fadeOut",
        callback: () => {
          navigate(-1);
        },
      });
    };

    // when partner reject your call
    socket.on("cancel_call", cancelCall);

    // when partner permit your call (1)
    socket.on("permit_call", permitCall);

    // receive partner's offer (3)
    socket.on("offer", receiveOffer);

    // receive partner's answer (5)
    socket.on("answer", receiveAnswer);

    socket.on("icecandidate", icecandidate);

    // when partner end call
    socket.on("end_call", endCall);

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }

      socket.off("cancel_call", cancelCall);
      socket.off("permit_call", permitCall);
      socket.off("offer", receiveOffer);
      socket.off("answer", receiveAnswer);
      socket.off("icecandidate", icecandidate);
      socket.off("end_call", endCall);
    };
  }, [navigate, setAlert, setAnimation, name, socket, stream, userInfo.name]);

  return (
    <div
      css={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        animation: animation ? animation + ".2s forwards ease-out" : "",
      }}
    >
      <video
        autoPlay
        playsInline
        ref={videoRef}
        css={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      ></video>
      <div
        css={{
          zIndex: 1000,
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bottom: 0,
          width: "100%",
          maxWidth: "390px",
          minWidth: "310px",
          boxSizing: "border-box",
        }}
      >
        <Select defaultValue={selectedAudio?.id} option={audioList} onChange={handleChangeAudio}></Select>
        <Select defaultValue={selectedCam?.id} option={camList} onChange={handleChangeCam}></Select>

        <div css={{ display: "flex", width: "100%" }}>
          <Button css={{ flex: 1 / 3 }} onClick={handleClickCamToggle}>
            <Icon src={onCam ? CamOnIcon : CamOffIcon}></Icon>
          </Button>
          <Button css={{ flex: 1 / 3 }} onClick={handleClickAudioToggle}>
            <Icon src={onAudio ? AudioOnIcon : AudioOffIcon}></Icon>
          </Button>
          <Button css={{ flex: 1 / 3 }} color="secondary" onClick={handleClickExit}>
            나가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoContainer;
