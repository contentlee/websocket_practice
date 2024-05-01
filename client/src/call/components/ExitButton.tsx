import { Button } from '@components';
import { HTMLAttributes } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Socket } from 'socket.io-client';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  socket: Socket;
  peerConnection: React.MutableRefObject<RTCPeerConnection | null>;
}

const ExitButton = ({ socket, peerConnection, ...props }: Props) => {
  const navigate = useNavigate();
  const { name } = useParams();

  const handleClickExit = (e: React.MouseEvent) => {
    e.preventDefault();

    socket.emit('end_call', name, () => {
      peerConnection.current?.close();
      navigate(-1);
    });
  };

  return (
    <Button {...props} color="secondary" onClick={handleClickExit}>
      나가기
    </Button>
  );
};

export default ExitButton;
