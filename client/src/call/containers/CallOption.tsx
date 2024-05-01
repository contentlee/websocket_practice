import { AudioSelect, AudioToggleButton, ExitButton } from '../components';
import { useOutletContext } from 'react-router';
import { Socket } from 'socket.io-client';
import { useContext } from 'react';
import { CallConnection } from '../contexts';

const CallOption = () => {
  const { socket } = useOutletContext<{ socket: Socket }>();

  const { peerConnection, audioList, stream } = useContext(CallConnection);

  return (
    <div
      css={{
        zIndex: 1000,
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        width: '100%',
        maxWidth: '390px',
        minWidth: '310px',
        boxSizing: 'border-box',
      }}
    >
      <AudioSelect peerConnection={peerConnection} stream={stream} audioList={audioList} />
      <div css={{ display: 'flex', width: '100%' }}>
        <AudioToggleButton css={{ flex: 1 / 2 }} stream={stream} />
        <ExitButton css={{ flex: 1 / 2 }} peerConnection={peerConnection} socket={socket} />
      </div>
    </div>
  );
};

export default CallOption;
