import { useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { io } from 'socket.io-client';

import { Alarm, Alert } from '../components';
import { useAlert } from '@hooks';

const CommonPage = () => {
  const navigate = useNavigate();
  const { addAlert } = useAlert();

  const socket = useRef(io('ws://192.168.0.122:8080'));

  useEffect(() => {
    const needLogin = () => {
      addAlert('error', '로그인이 필요합니다.');
      navigate('/login');
    };
    socket.current.on('need_login', needLogin);
    return () => {
      socket.current.off('need_login', needLogin);
    };
  }, []);

  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Alert />
      <Alarm socket={socket.current} />
      <Outlet context={{ socket: socket.current }} />
    </div>
  );
};

export default CommonPage;
