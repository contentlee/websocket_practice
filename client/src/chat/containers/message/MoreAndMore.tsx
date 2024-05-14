import { useEffect, useRef } from 'react';

import { palette } from '@utils/palette';
import Io from '@utils/io';

interface Props {
  io: Io;
}

const MoreAndMore = ({ io }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) io.observe(ref.current);

    return () => {
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <hr
        css={{
          display: 'flex',
          flex: 'auto',
          height: '0.5px',
          background: palette.gray.gray83,
          border: 'none',
        }}
      />
      <div css={{ color: palette.gray.gray83, fontSize: '12px' }}>이전 메세지 더 보기</div>
      <hr
        css={{
          display: 'flex',
          flex: 'auto',
          height: '0.5px',
          background: palette.gray.gray83,
          border: 'none',
        }}
      />
    </div>
  );
};

export default MoreAndMore;
