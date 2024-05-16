import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { Socket } from 'socket.io-client';

import { AlarmLayout, RejectButton, PermitButton } from '.';

interface Props {
  socket: Socket;
}

const Alarm = ({ socket }: Props) => {
  const navigate = useNavigate();

  const [isOpened, setOpened] = useState(false);
  const [type, setType] = useState<'call' | 'video'>('call');
  const [name, setName] = useState('');

  const requirePermitCall = () => {
    if (!isOpened) return;
    setOpened(false);
    navigate(`/${type}/${name}`);
  };

  const requireCancelCall = () => {
    if (!isOpened) return;
    const closeAlarm = () => setOpened(false);
    socket.emit('reject_call', name, closeAlarm);
  };

  useEffect(() => {
    const requireCall = (userName: string) => {
      setOpened(true);
      setType('call');
      setName(userName);
    };
    socket.on('require_call', requireCall);

    const requireVideoCall = (userName: string) => {
      setOpened(true);
      setType('video');
      setName(userName);
    };
    socket.on('require_video_call', requireVideoCall);

    const cancelCall = () => {
      setOpened(false);
    };
    socket.on('cancel_call', cancelCall);

    return () => {
      socket.off('require_call', requireCall);
      socket.off('require_video_call', requireVideoCall);
      socket.off('cancel_call', cancelCall);
    };
  }, [socket]);

  return (
    isOpened &&
    createPortal(
      <AlarmLayout>
        <PermitButton type={type} permitCall={requirePermitCall} />
        <RejectButton type={type} cancelCall={requireCancelCall} />
      </AlarmLayout>,
      document.body,
      'alarm',
    )
  );
};

export default Alarm;
