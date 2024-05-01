import { ButtonHTMLAttributes, MutableRefObject, useEffect, useState } from 'react';

import { Button, Icon } from '@components';

import AudioOnIcon from '@assets/mic_on_icon.svg';
import AudioOffIcon from '@assets/mic_off_icon.svg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  stream: MutableRefObject<MediaStream | null>;
}

const AudioToggleButton = ({ stream }: Props) => {
  const [onAudio, setOnAudio] = useState(false);

  const handleClickAudioToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    stream.current?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setOnAudio(track.enabled);
    });
  };

  useEffect(() => {
    setOnAudio(true);
  }, [stream]);
  return (
    <Button onClick={handleClickAudioToggle}>
      <Icon src={onAudio ? AudioOnIcon : AudioOffIcon}></Icon>
    </Button>
  );
};

export default AudioToggleButton;
