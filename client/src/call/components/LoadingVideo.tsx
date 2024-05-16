import { Spinner } from '@components';
import { palette } from '@utils/palette';
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '14px',
        gap: '24px',
      }}
    >
      <Spinner />
      <div>연결중입니다!</div>
    </div>
  );
};

export default LoadingVideo;
