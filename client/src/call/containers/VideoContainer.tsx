import { useOutletContext } from 'react-router';
import { useEffect, useContext } from 'react';
import { Socket } from 'socket.io-client';

import { useCallConnect, useRTCConnect } from '@hooks';
import { VideoConnection } from '../contexts';
import VideoOption from './VideoOption';

const VideoContainer = () => {
  const { socket } = useOutletContext<{ socket: Socket }>();

  const { peerConnection, myVideoRef, peerVideoRef } = useContext(VideoConnection);
  const { permitCall, cancelCall, endCall } = useCallConnect({ peerConnection, socket });
  const { receiveAnswer, receiveOffer, icecandidate } = useRTCConnect({
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
      <div
        css={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          marginBottom: '126px',
        }}
      >
        <video
          muted
          autoPlay
          playsInline
          controls={false}
          ref={peerVideoRef}
          css={{
            width: '100%',
            height: '100%',
          }}
        />
        <video
          muted
          autoPlay
          playsInline
          controls={false}
          ref={myVideoRef}
          css={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
      <VideoOption />
    </div>
  );
};

export default VideoContainer;
