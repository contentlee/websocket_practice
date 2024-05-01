import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const AlarmLayout = ({ children }: Props) => {
  return (
    <div
      css={{
        zIndex: 1500,
        position: 'absolute',
        bottom: 0,
      }}
    >
      <div
        css={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '390px',
          minWidth: '310px',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AlarmLayout;
