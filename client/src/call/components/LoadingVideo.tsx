import { useEffect } from 'react';

interface Props {
  callState: 'connect' | 'waiting';
}

const LoadingVideo = ({ callState }: Props) => {
  useEffect(() => {
    let timeoutId = undefined;
    if (callState === 'connect') {
      timeoutId = setTimeout(() => {}, 10000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      css={{
        flex: 1,
      }}
    >
      연결중입니다!
    </div>
  );
};

export default LoadingVideo;
