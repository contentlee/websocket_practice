import { useEffect, useRef } from 'react';

interface Props {
  stream: MediaStream | null;
}

const MyVideo = ({ stream }: Props) => {
  const myVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream && myVideoRef.current) myVideoRef.current.srcObject = stream;
  }, [myVideoRef.current, stream]);
  return (
    <video
      muted
      autoPlay
      playsInline
      controls={false}
      ref={myVideoRef}
      css={{
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default MyVideo;
