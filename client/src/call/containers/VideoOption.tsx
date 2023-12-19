import { useContext, useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { Socket } from 'socket.io-client';

import AudioOnIcon from '@assets/mic_on_icon.svg';
import AudioOffIcon from '@assets/mic_off_icon.svg';
import VideoOnIcon from '@assets/videocam_on_icon.svg';
import VideoOffIcon from '@assets/videocam_off_icon.svg';

import { VideoConnection } from '../contexts';
import { getMedia } from '../helpers/connection';

import { Button, Icon } from '@components';
import { Select } from '../components';

const VideoOption = () => {
  const navigate = useNavigate();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const { peerConnection, stream, audioList, myVideoRef, videoList } = useContext(VideoConnection);

  const [selectedAudio, setSelectedAudio] = useState<MediaStreamTrack>();
  const [onAudio, setOnAudio] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState<MediaStreamTrack>();
  const [onVideo, setOnVideo] = useState(false);

  // select audio
  const handleChangeAudio = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const value = e.target.value;
    const mediaStream = await getMedia({
      audio: { deviceId: value },
      video: { deviceId: selectedVideo?.getConstraints().deviceId },
    });

    if (myVideoRef.current) myVideoRef.current.srcObject = mediaStream;
    setSelectedAudio(mediaStream.getAudioTracks()[0]);

    const audioSender = peerConnection.current
      ?.getSenders()
      .find((sender) => sender.track?.kind === 'audio');
    await audioSender?.replaceTrack(mediaStream.getTracks()[0]);

    if (!onAudio)
      mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });

    stream.current = mediaStream;
  };

  // mute or unmute
  const handleClickAudioToggle = (e: React.MouseEvent) => {
    e.preventDefault();

    stream.current?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setOnAudio(track.enabled);
    });
  };

  // select video
  const handleChangeVideo = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const value = e.target.value;
    const mediaStream = await getMedia({
      video: { deviceId: value },
      audio: { deviceId: selectedAudio?.getConstraints().deviceId },
    });

    if (myVideoRef.current) myVideoRef.current.srcObject = mediaStream;
    setSelectedVideo(mediaStream.getVideoTracks()[0]);

    const videoSender = peerConnection.current
      ?.getSenders()
      .find((sender) => sender.track?.kind === 'video');
    await videoSender?.replaceTrack(mediaStream.getVideoTracks()[0]);

    if (!onVideo)
      mediaStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });

    if (!onAudio)
      mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });

    stream.current = mediaStream;
  };

  // turnOn or turnOff
  const handleClickVideoToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (myVideoRef.current?.srcObject) {
      (myVideoRef.current.srcObject as MediaStream).getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setOnVideo(track.enabled);
      });
    }
    stream.current?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setOnVideo(track.enabled);
    });
  };

  // close page
  const handleClickExit = (e: React.MouseEvent) => {
    e.preventDefault();

    socket.emit('end_call', name, () => {
      peerConnection.current?.close();
      navigate(-1);
    });
  };

  useEffect(() => {
    setSelectedAudio(stream.current?.getAudioTracks()[0]);
    setOnAudio(true);
    setSelectedVideo(stream.current?.getVideoTracks()[0]);
    setOnVideo(true);
  }, [stream]);

  return (
    <div
      css={{
        zIndex: 1000,
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        width: '100%',
        maxWidth: '390px',
        minWidth: '310px',
        boxSizing: 'border-box',
      }}
    >
      <Select
        defaultValue={selectedVideo?.id}
        option={videoList}
        onChange={handleChangeVideo}
      ></Select>
      <Select
        defaultValue={selectedAudio?.id}
        option={audioList}
        onChange={handleChangeAudio}
      ></Select>

      <div css={{ display: 'flex', width: '100%' }}>
        <Button css={{ flex: 1 / 3 }} onClick={handleClickVideoToggle}>
          <Icon src={onVideo ? VideoOnIcon : VideoOffIcon}></Icon>
        </Button>
        <Button css={{ flex: 1 / 3 }} onClick={handleClickAudioToggle}>
          <Icon src={onAudio ? AudioOnIcon : AudioOffIcon}></Icon>
        </Button>
        <Button css={{ flex: 1 / 3 }} color="secondary" onClick={handleClickExit}>
          나가기
        </Button>
      </div>
    </div>
  );
};

export default VideoOption;
