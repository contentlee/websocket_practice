import { HTMLAttributes, useEffect, useState } from 'react';

import VideoOnIcon from '@assets/videocam_on_icon.svg';
import VideoOffIcon from '@assets/videocam_off_icon.svg';

import { Button, Icon } from '@components';

interface Props extends HTMLAttributes<HTMLDivElement> {
  stream: MediaStream | null;
  toggleStream: (type: 'audio' | 'video') => boolean;
}

const VideoToggleButton = ({ stream, toggleStream, ...props }: Props) => {
  const [onVideo, setOnVideo] = useState(false);

  const handleClickVideoToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const flag = toggleStream('video');
    setOnVideo(flag);
  };

  useEffect(() => {
    const enabled = stream?.getVideoTracks()[0].enabled;
    if (enabled) setOnVideo(enabled);
  }, [stream]);
  return (
    <div {...props}>
      <Button css={{ width: '100%' }} onClick={handleClickVideoToggle}>
        <Icon src={onVideo ? VideoOnIcon : VideoOffIcon}></Icon>
      </Button>
    </div>
  );
};

export default VideoToggleButton;
