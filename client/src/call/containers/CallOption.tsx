import AudioOnIcon from '@assets/mic_on_icon.svg';
import AudioOffIcon from '@assets/mic_off_icon.svg';

import { Button, Icon } from '@components';
import { Select } from '../components';
import { useNavigate, useOutletContext } from 'react-router';
import { Socket } from 'socket.io-client';
import { useContext, useEffect, useState } from 'react';
import { CallConnection } from '../contexts';
import { getMedia } from '../helpers/connection';

const CallOption = () => {
  const navigate = useNavigate();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const { peerConnection, audioList, stream } = useContext(CallConnection);

  const [selectedAudio, setSelectedAudio] = useState<MediaStreamTrack>();
  const [onAudio, setOnAudio] = useState(false);
  // select audio
  const handleChangeAudio = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const value = e.target.value;
    const mediaStream = await getMedia({ audio: { deviceId: value } });

    setSelectedAudio(mediaStream.getTracks()[0]);

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

  // close page
  const handleClickExit = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('end_call', name, () => {
      peerConnection.current?.close();
      navigate(-1);
    });
  };

  useEffect(() => {
    setSelectedAudio(stream.current?.getTracks()[0]);
    setOnAudio(true);
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
        defaultValue={selectedAudio?.id}
        option={audioList}
        onChange={handleChangeAudio}
      ></Select>

      <div css={{ display: 'flex', width: '100%' }}>
        <Button css={{ flex: 1 / 2 }} onClick={handleClickAudioToggle}>
          <Icon src={onAudio ? AudioOnIcon : AudioOffIcon}></Icon>
        </Button>
        <Button css={{ flex: 1 / 2 }} color="secondary" onClick={handleClickExit}>
          나가기
        </Button>
      </div>
    </div>
  );
};

export default CallOption;
