import VideoOnIcon from '@assets/videocam_on_icon.svg';
import VideoOffIcon from '@assets/videocam_off_icon.svg';

import { Button, Icon } from '@components';
import { ButtonHTMLAttributes, MutableRefObject, RefObject, useEffect, useState } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  videoRef: RefObject<HTMLVideoElement>;
  stream: MutableRefObject<MediaStream | null>;
}

const VideoToggleButton = ({ videoRef, stream }: Props) => {
  const [onVideo, setOnVideo] = useState(false);

  const handleClickVideoToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setOnVideo(track.enabled);
      });
    }
    stream.current?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setOnVideo(track.enabled);
    });
  };

  useEffect(() => {
    setOnVideo(true);
  }, [stream]);
  return (
    <Button onClick={handleClickVideoToggle}>
      <Icon src={onVideo ? VideoOnIcon : VideoOffIcon}></Icon>
    </Button>
  );
};

export default VideoToggleButton;
