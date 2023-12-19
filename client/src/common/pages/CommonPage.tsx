import { useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { io } from 'socket.io-client';

import { AlarmContainer, AlertContainer } from '../containers';

import { Overlay } from '../components';
import { useAlert } from '@hooks';

const CommonPage = () => {
  const navigate = useNavigate();
  const [_, setAlert] = useAlert();

  const socket = useRef(io('ws://localhost:8080'));

  useEffect(() => {
    const needLogin = () => {
      setAlert('error', '로그인이 필요합니다.');
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
      <Overlay />
      <AlertContainer />
      <AlarmContainer socket={socket.current} />
      <Outlet context={{ socket: socket.current }}></Outlet>
    </div>
  );
};

export default CommonPage;
