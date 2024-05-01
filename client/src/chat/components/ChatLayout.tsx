import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const ChatLayout = ({ children }: Props) => {
  return (
    <div
      css={{
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

export default ChatLayout;
