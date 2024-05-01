import { useEffect, useState } from 'react';

import { palette } from '@utils/palette';

interface Props {
  state: 'connect' | 'waiting' | 'need_mic';
}

const CallState = ({ state }: Props) => {
  const [current, setCurrent] = useState(state);

  useEffect(() => {
    setCurrent(state);
  }, [state]);
  return (
    <div
      css={{
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        css={{
          padding: '16px 32px',
          background:
            current === 'connect'
              ? palette.point.green
              : current === 'waiting'
                ? palette.point.red
                : palette.point.yellow,
          color: palette.main.wht,
          fontSize: '16px',
          fontWeight: 700,
          userSelect: 'none',
        }}
      >
        {current === 'connect' && '통화중'}
        {current === 'waiting' && '연결중'}
        {current === 'need_mic' && '마이크에 대한 접근이 필요합니다.'}
      </div>
    </div>
  );
};

export default CallState;
