import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { Socket } from 'socket.io-client';

import { AlarmLayout, CancelButton, PermitButton } from '.';

interface Props {
  socket: Socket;
}

const Alarm = ({ socket }: Props) => {
  const navigate = useNavigate();

  const [isOpened, setOpened] = useState(false);
  const [type, setType] = useState<'call' | 'video'>('call');
  const [name, setName] = useState('');

  const permitCall = () => {
    setOpened(false);
    navigate(`/${type}/${name}`);
  };

  const cancelCall = () => {
    const closeAlarm = () => setOpened(false);
    socket.emit('cancel_call', name, closeAlarm);
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

    return () => {
      socket.off('require_call', requireCall);
      socket.off('require_video_call', requireVideoCall);
    };
  }, [socket]);

  return (
    isOpened &&
    createPortal(
      <AlarmLayout>
        <PermitButton type={type} permitCall={permitCall} />
        <CancelButton type={type} cancelCall={cancelCall} />
      </AlarmLayout>,
      document.body,
      'alarm',
    )
  );
};

export default Alarm;
