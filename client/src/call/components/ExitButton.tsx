import { HTMLAttributes } from 'react';

import { Button } from '@components';
import { callSocket } from '@socket';

interface Props extends HTMLAttributes<HTMLDivElement> {
  roomName: string;
  userName: string;
  exitCall: () => void;
}

const ExitButton = ({ roomName, userName, exitCall, ...props }: Props) => {
  const handleClickExit = (e: React.MouseEvent) => {
    e.preventDefault();

    callSocket.finishCall(roomName, userName, exitCall);
  };

  return (
    <div {...props}>
      <Button css={{ width: '100%' }} color="secondary" onClick={handleClickExit}>
        나가기
      </Button>
    </div>
  );
};

export default ExitButton;
