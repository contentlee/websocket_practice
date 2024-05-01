import { MouseEvent } from 'react';

import { palette } from '@utils/palette';

const MoreAndMore = () => {
  const handleClickMore = (e: MouseEvent) => {
    e.preventDefault;
  };

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
      onClick={handleClickMore}
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
