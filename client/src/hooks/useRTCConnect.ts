import { useState } from 'react';
import { useParams } from 'react-router';

import { Socket } from 'socket.io-client';
import useAlert from './useAlert';

type State = 'connect' | 'waiting';

interface Props {
  socket: Socket;
  peerConnection: React.MutableRefObject<RTCPeerConnection | null>;
}

const useRTCConnect = ({ socket, peerConnection }: Props) => {
  const { name: roomName } = useParams();
  const { addAlert } = useAlert();

  const [callState, setCallState] = useState<State>('waiting');

  const receiveOffer = async (offer: RTCSessionDescription) => {
    try {
      await peerConnection.current?.setRemoteDescription(offer);
      const answer = await peerConnection.current?.createAnswer();
      await peerConnection.current?.setLocalDescription(answer);

      // send my answer (this name is roomname) (4)
      socket.emit('answer', roomName, answer, () => {
        addAlert('success', '상대방과의 연결을 시작합니다.');
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

  return { callState, receiveOffer, receiveAnswer, icecandidate };
};

export default useRTCConnect;
