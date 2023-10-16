import { useRef } from 'react';
import { Outlet } from 'react-router';
import { io } from 'socket.io-client';

import { AlarmContainer, AlertContainer } from '../containers';

import { Overlay } from '../components';

const CommonPage = () => {
  const socket = useRef(io('ws://localhost:8080'));
  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
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
