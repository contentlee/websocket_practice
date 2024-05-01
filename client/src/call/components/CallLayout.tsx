import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const CallLayout = ({ children }: Props) => {
  return (
    <div
      css={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

export default CallLayout;
