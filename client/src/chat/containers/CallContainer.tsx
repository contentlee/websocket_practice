import { useEffect, useRef, useState } from "react";

import { alertAtom } from "@atoms/stateAtom";
import { userAtom } from "@atoms/userAtom";
import { useNavigate, useOutletContext } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil";
import { Socket } from "socket.io-client";
import Select from "../components/Select";
import { Button, Icon } from "@components";

import AudioOnIcon from "@assets/mic_on_icon.svg";
import AudioOffIcon from "@assets/mic_off_icon.svg";

const CallContainer = () => {
  const navigate = useNavigate();

  const userInfo = useRecoilValue(userAtom);
  const [_, setAlert] = useRecoilState(alertAtom);

  const { socket } = useOutletContext<{ socket: Socket }>();

  const audioRef = useRef<HTMLVideoElement>(null);

  const [stream, setStream] = useState<MediaStream>();

  const [onAudio, setOnAudio] = useState(false);

  const [selectedAudio, setSelectedAudio] = useState<MediaStreamTrack>();

  const [audioList, setAudioList] = useState<MediaDeviceInfo[]>([]);

  const handleChangeAudio = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value;
    const mediaStream = await getMedia(value);
    if (audioRef.current) audioRef.current.srcObject = mediaStream;
    setStream(mediaStream);
  };

  const handleClickAudioToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setOnAudio(track.enabled);
    });
  };

  const handleClickExit = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(-1);
  };

  const getMedia = (audio = "") => {
    const constrains = {
      audio: audio !== "" ? { deviceId: audio } : true,
    };
    return navigator.mediaDevices.getUserMedia(constrains);
  };

  const getDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return {
      cam: devices.filter((device) => device.kind === "videoinput"),
      audio: devices.filter((device) => device.kind === "audioinput"),
    };
  };

  const init = async () => {
    try {
      const mediaStream = await getMedia();
      const { audio } = await getDevices();

      if (audioRef.current) audioRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setAudioList(audio);
      setSelectedAudio(mediaStream.getAudioTracks()[0]);
      setOnAudio(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    init();
  }, []);

  socket.on("permit_call", () => {
    setAlert({ isOpened: true, type: "success", children: "상대방과의 연결을 시작합니다." });
  });
  socket.on("cancel_call", () => {
    socket.emit("end_call", userInfo.name);
    navigate(-1);
  });
  socket.on("end_call", () => {
    setAlert({ isOpened: true, type: "warning", children: "상대방이 통화를 종료하였습니다." });
    navigate(-1);
  });

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
      }}
    >
      <audio
        autoPlay
        playsInline
        ref={audioRef}
        css={{
          display: "none",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      />
      <div
        css={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        통화중
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

export default CallContainer;
