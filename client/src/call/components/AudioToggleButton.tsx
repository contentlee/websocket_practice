import { HTMLAttributes, useEffect, useState } from 'react';

import { Button, Icon } from '@components';

import AudioOnIcon from '@assets/mic_on_icon.svg';
import AudioOffIcon from '@assets/mic_off_icon.svg';

interface Props extends HTMLAttributes<HTMLDivElement> {
  stream: MediaStream | null;
  toggleStream: (type: 'audio' | 'video') => boolean;
}

const AudioToggleButton = ({ stream, toggleStream, ...props }: Props) => {
  const [onAudio, setOnAudio] = useState(false);

  const handleClickAudioToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const flag = toggleStream('audio');
    setOnAudio(flag);
  };

  useEffect(() => {
    const enabled = stream?.getAudioTracks()[0].enabled;
    if (enabled) setOnAudio(enabled);
  }, [stream]);
  return (
    <div {...props}>
      <Button css={{ width: '100%' }} onClick={handleClickAudioToggle}>
        <Icon src={onAudio ? AudioOnIcon : AudioOffIcon}></Icon>
      </Button>
    </div>
  );
};

export default AudioToggleButton;
