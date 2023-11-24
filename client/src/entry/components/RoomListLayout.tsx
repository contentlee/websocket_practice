import { ClassAttributes, HTMLAttributes, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement>, ClassAttributes<HTMLDivElement> {
  children: ReactNode;
}

const RoomListLayout = ({ children, ...props }: Props) => {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: '10px',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default RoomListLayout;
