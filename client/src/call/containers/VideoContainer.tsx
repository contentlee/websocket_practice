import { useNavigate, useOutletContext, useParams } from 'react-router';
import { useEffect, useState, useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';

import { alertAtom } from '@atoms/stateAtom';
import { userAtom } from '@atoms/userAtom';

import { VideoConnection } from '../contexts';
import VideoOption from './VideoOption';

const VideoContainer = () => {
  const navigate = useNavigate();

  const { name: roomName } = useParams();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const [_, setAlert] = useRecoilState(alertAtom);
  const { name: myName } = useRecoilValue(userAtom);

  const { peerConnection, myVideoRef, peerVideoRef } = useContext(VideoConnection);

  const [callState, setCallState] = useState('waiting');
  const [permit, setPermit] = useState(false);

  if (roomName !== myName && !permit && peerConnection.current) {
    socket.emit('permit_call', roomName, () => {
      setPermit(true);
    });
  }

  useEffect(() => {
    const permitCall = async () => {
      try {
        const offer = await peerConnection.current?.createOffer();
        await peerConnection.current?.setLocalDescription(offer);
        // send your offer (2)
        socket.emit('offer', roomName, offer, () => {
          setAlert({
            isOpened: true,
            type: 'success',
            children: '상대방과의 연결을 시작합니다.',
          });
        });
      } catch (err) {
        console.log(err);
      }
    };
    // when partner permit your call (1)
    socket.on('permit_call', permitCall);

    const receiveOffer = async (offer: RTCSessionDescription) => {
      try {
        await peerConnection.current?.setRemoteDescription(offer);
        const answer = await peerConnection.current?.createAnswer();
        await peerConnection.current?.setLocalDescription(answer);
        // send my answer (this name is roomname) (4)
        socket.emit('answer', roomName, answer, () => {
          setAlert({
            isOpened: true,
            type: 'success',
            children: '상대방과의 연결을 시작합니다.',
          });
        });
      } catch (err) {
        console.log(err);
      }
    };
    // receive partner's offer (3)
    socket.on('offer', receiveOffer);

    const receiveAnswer = async (answer: RTCSessionDescription) => {
      try {
        await peerConnection.current?.setRemoteDescription(answer);
        setCallState('connect');
        console.log(callState);
      } catch (err) {
        console.log(err);
      }
    };
    // receive partner's answer (5)
    socket.on('answer', receiveAnswer);

    const icecandidate = async (ice: RTCIceCandidateInit) => {
      try {
        if (peerConnection.current?.getReceivers())
          await peerConnection.current?.addIceCandidate(ice);
      } catch (err) {
        console.log(err);
      }
    };
    socket.on('icecandidate', icecandidate);

    const cancelCall = () => {
      socket.emit('end_call', roomName, () => {
        peerConnection.current?.close();
        navigate(-1);
      });
    };
    // when partner reject your call
    socket.on('cancel_call', cancelCall);

    const endCall = () => {
      setAlert({
        isOpened: true,
        type: 'warning',
        children: '상대방이 통화를 종료하였습니다.',
      });

      peerConnection.current?.close();
      navigate(-1);
    };
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
  }, [roomName, socket, peerConnection, navigate, setAlert]);

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
