import { useEffect, useRef } from 'react';

interface Props {
  stream: MediaStream | null;
}

const PeerVideo = ({ stream }: Props) => {
  const peerVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (peerVideoRef.current) {
      peerVideoRef.current.srcObject = stream;
      peerVideoRef.current.load();
    }
  }, [peerVideoRef.current, stream]);
  return (
    <video
      autoPlay
      playsInline
      controls={false}
      ref={peerVideoRef}
      css={{
        flex: 1,
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default PeerVideo;
