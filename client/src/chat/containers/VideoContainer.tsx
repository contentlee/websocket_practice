import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import CamOnIcon from "@assets/videocam_on_icon.svg";
import CamOffIcon from "@assets/videocam_off_icon.svg";
import AudioOnIcon from "@assets/mic_on_icon.svg";
import AudioOffIcon from "@assets/mic_off_icon.svg";

import { Button, Icon } from "@components";

import Select from "../components/Select";

const VideoContainer = () => {
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);

  const [stream, setStream] = useState<MediaStream>();

  const [onCam, setOnCam] = useState(false);
  const [onAudio, setOnAudio] = useState(false);

  const [selectedCam, setSelectedCam] = useState<MediaStreamTrack>();
  const [selectedAudio, setSelectedAudio] = useState<MediaStreamTrack>();

  const [audioList, setAudioList] = useState<MediaDeviceInfo[]>([]);
  const [camList, setCamList] = useState<MediaDeviceInfo[]>([]);

  const handleChangeCam = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value;
    const mediaStream = await getMedia(selectedAudio!.id, value);
    if (videoRef.current) videoRef.current.srcObject = mediaStream;
    setStream(mediaStream);
  };

  const handleChangeAudio = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value;
    const mediaStream = await getMedia(value, selectedAudio!.id);
    if (videoRef.current) videoRef.current.srcObject = mediaStream;
    setStream(mediaStream);
  };

  const handleClickCamToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setOnCam(track.enabled);
    });
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

  const getMedia = (audio = "", video = "") => {
    const constrains = {
      audio: audio !== "" ? { deviceId: audio } : true,
      video: video !== "" ? { deviceId: video } : true,
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

  useEffect(() => {
    init();
  }, []);
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
