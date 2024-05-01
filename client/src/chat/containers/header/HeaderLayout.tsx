import { ReactNode } from 'react';

import { palette } from '@utils/palette';

interface Props {
  children: ReactNode;
}
const HeaderLayout = ({ children }: Props) => {
  return (
    <div
      css={{
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        top: 0,
        left: 0,
        boxSizing: 'border-box',
        background: palette.background,
      }}
    >
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '390px',
          minWidth: '310px',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default HeaderLayout;
