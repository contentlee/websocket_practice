import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

import { Alarm, Alert } from '../components';
import { useAlert } from '@hooks';

import { socket, loginSocket } from '@socket';

const CommonPage = () => {
  const navigate = useNavigate();
  const { addAlert } = useAlert();

  useEffect(() => {
    const needLogin = () => {
      addAlert('error', '로그인이 필요합니다.');
      navigate('/login');
    };
    loginSocket.needLogin(needLogin).on();

    return () => {
      loginSocket.needLogin(needLogin).off();
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
      <Alarm socket={socket.get()} />
      <Outlet />
    </div>
  );
};

export default CommonPage;
