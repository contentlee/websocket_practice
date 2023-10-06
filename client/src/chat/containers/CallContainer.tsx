import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil";
import { Socket } from "socket.io-client";

import { alertAtom } from "@atoms/stateAtom";
import { userAtom } from "@atoms/userAtom";

import { palette } from "@utils/palette";

import Select from "../components/Select";

import { Button, Icon } from "@components";

import AudioOnIcon from "@assets/mic_on_icon.svg";
import AudioOffIcon from "@assets/mic_off_icon.svg";
import { useAnimate } from "@hooks";

const CallContainer = () => {
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

  // Audio Stream
  const audioRef = useRef<HTMLAudioElement>(null);

  const [onAudio, setOnAudio] = useState(false);

  const [stream, setStream] = useState<MediaStream>();
  const [selectedAudio, setSelectedAudio] = useState<MediaStreamTrack>();
  const [audioList, setAudioList] = useState<MediaDeviceInfo[]>([]);

  // select audio
  const handleChangeAudio = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value;
    const mediaStream = await getMedia(value);
    if (audioRef.current) audioRef.current.srcObject = mediaStream;
    setStream(mediaStream);
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
  const getMedia = (audio = "") => {
    const constrains = {
      audio: audio !== "" ? { deviceId: audio } : true,
    };
    return navigator.mediaDevices.getUserMedia(constrains);
  };

  // find all devices
  const getDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "audioinput");
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
    // audio init
    const audioInit = async () => {
      try {
        const mediaStream = await getMedia();
        const audio = await getDevices();

        if (audioRef.current) audioRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setAudioList(audio);
        setSelectedAudio(mediaStream.getAudioTracks()[0]);
        setOnAudio(true);
      } catch (err) {
        console.log(err);
      }
    };
    audioInit();

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
      <audio
        muted
        autoPlay
        playsInline
        ref={audioRef}
        css={{
          display: "none",
        }}
      />
      <div
        css={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {audioList.length ? (
          <div
            css={{
              padding: "16px 32px",
              background: callState === "connect" ? palette.point.green : palette.point.red,
              color: palette.main.wht,
              fontSize: "16px",
              fontWeight: 700,
              userSelect: "none",
            }}
          >
            {callState === "connect" ? "통화중" : "연결중"}
          </div>
        ) : (
          <div
            css={{
              padding: "16px 32px",
              background: palette.point.yellow,
              color: palette.main.wht,
              fontSize: "16px",
              fontWeight: 700,
              userSelect: "none",
            }}
          >
            마이크에 대한 접근이 필요합니다.
          </div>
        )}
      </div>
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

        <div css={{ display: "flex", width: "100%" }}>
          <Button css={{ flex: 1 / 2 }} onClick={handleClickAudioToggle}>
            <Icon src={onAudio ? AudioOnIcon : AudioOffIcon}></Icon>
          </Button>
          <Button css={{ flex: 1 / 2 }} color="secondary" onClick={handleClickExit}>
            나가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallContainer;
