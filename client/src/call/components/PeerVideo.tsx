import { useEffect, useRef } from 'react';

interface Props {
  addTrackEvent: (device: HTMLVideoElement | HTMLAudioElement) => void;
}

const PeerVideo = ({ addTrackEvent }: Props) => {
  const peerVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (peerVideoRef.current) addTrackEvent(peerVideoRef.current);
  }, [peerVideoRef.current]);
  return (
    <video
      muted
      autoPlay
      playsInline
      controls={false}
      ref={peerVideoRef}
      css={{
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default PeerVideo;
