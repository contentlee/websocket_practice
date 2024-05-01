import { useEffect, useContext } from 'react';
import { useOutletContext } from 'react-router';
import { Socket } from 'socket.io-client';

import { CallConnection } from '../contexts';
import CallOption from './CallOption';
import { useCallConnect, useRTCConnect } from '@hooks';
import { CallState } from '../components';

const CallContainer = () => {
  const { socket } = useOutletContext<{ socket: Socket }>();

  const { peerConnection, audioList, audioRef } = useContext(CallConnection);
  const { permitCall, cancelCall, endCall } = useCallConnect({ peerConnection, socket });
  const { callState, receiveAnswer, receiveOffer, icecandidate } = useRTCConnect({
    peerConnection,
    socket,
  });

  useEffect(() => {
    // when partner permit your call (1)
    socket.on('permit_call', permitCall);

    // receive partner's offer (3)
    socket.on('offer', receiveOffer);

    // receive partner's answer (5)
    socket.on('answer', receiveAnswer);

    socket.on('icecandidate', icecandidate);

    // when partner reject your call
    socket.on('cancel_call', cancelCall);

    // when partner end call
    socket.on('end_call', endCall);

    return () => {
      socket.off('cancel_call', cancelCall);
      socket.off('permit_call', permitCall);
      socket.off('offer', receiveOffer);
      socket.off('answer', receiveAnswer);
      socket.off('icecandidate', icecandidate);
      socket.off('end_call', endCall);
    };
  }, [socket, peerConnection]);

  return (
    <div
      css={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <audio
        autoPlay
        playsInline
        controls={false}
        ref={audioRef}
        css={{
          display: 'none',
        }}
      />
      <div
        css={{
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <CallState state={audioList.length ? 'need_mic' : callState} />
      </div>
      <CallOption />
    </div>
  );
};

export default CallContainer;
