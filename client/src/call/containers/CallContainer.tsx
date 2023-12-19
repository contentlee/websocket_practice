import { useEffect, useState, useContext } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';

import { alertAtom } from '@atoms/stateAtom';
import { userAtom } from '@atoms/userAtom';
import { palette } from '@utils/palette';

import { CallConnection } from '../contexts';
import CallOption from './CallOption';

const CallContainer = () => {
  const navigate = useNavigate();

  const { name: roomName } = useParams();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const [_, setAlert] = useRecoilState(alertAtom);
  const { name: myName } = useRecoilValue(userAtom);

  const { peerConnection, audioList, audioRef } = useContext(CallConnection);

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
          setCallState('connect');
        });
      } catch (err) {
        console.log(err);
      }
    };

    const receiveAnswer = async (answer: RTCSessionDescription) => {
      try {
        await peerConnection.current?.setRemoteDescription(answer);
        setCallState('connect');
      } catch (err) {
        console.log(err);
      }
    };

    const icecandidate = async (ice: RTCIceCandidateInit) => {
      try {
        await peerConnection.current?.addIceCandidate(ice);
      } catch (err) {
        console.log(err);
      }
    };

    const cancelCall = () => {
      socket.emit('end_call', roomName, () => {
        setAlert({
          isOpened: true,
          type: 'warning',
          children: '상대방이 통화를 거부하였습니다.',
        });
        peerConnection.current?.close();
        navigate(-1);
      });
    };

    const endCall = () => {
      setAlert({
        isOpened: true,
        type: 'warning',
        children: '상대방이 통화를 종료하였습니다.',
      });
      peerConnection.current?.close();
      navigate(-1);
    };

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
        {audioList.length ? (
          <div
            css={{
              padding: '16px 32px',
              background: callState === 'connect' ? palette.point.green : palette.point.red,
              color: palette.main.wht,
              fontSize: '16px',
              fontWeight: 700,
              userSelect: 'none',
            }}
          >
            {callState === 'connect' ? '통화중' : '연결중'}
          </div>
        ) : (
          <div
            css={{
              padding: '16px 32px',
              background: palette.point.yellow,
              color: palette.main.wht,
              fontSize: '16px',
              fontWeight: 700,
              userSelect: 'none',
            }}
          >
            마이크에 대한 접근이 필요합니다.
          </div>
        )}
      </div>
      <CallOption />
    </div>
  );
};

export default CallContainer;
