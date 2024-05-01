import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@atoms/userAtom';

import { Socket } from 'socket.io-client';
import useAlert from './useAlert';

interface Props {
  socket: Socket;
  peerConnection: React.MutableRefObject<RTCPeerConnection | null>;
}

const useCallConnect = ({ socket, peerConnection }: Props) => {
  const navigate = useNavigate();

  const { name: roomName } = useParams();
  const { name: myName } = useRecoilValue(userAtom);

  const { addAlert } = useAlert();

  const [permit, setPermit] = useState(false);

  const permitCall = async () => {
    try {
      const offer = await peerConnection.current?.createOffer();
      await peerConnection.current?.setLocalDescription(offer);
      // send your offer (2)
      socket.emit('offer', roomName, offer, () => {
        addAlert('success', '상대방과의 연결을 시작합니다.');
      });
    } catch (err) {
      console.log(err);
    }
  };

  const cancelCall = () => {
    socket.emit('end_call', roomName, () => {
      addAlert('warning', '상대방이 통화를 거부하였습니다.');
      peerConnection.current?.close();
      navigate(-1);
    });
  };

  const endCall = () => {
    addAlert('warning', '상대방이 통화를 종료하였습니다.');
    peerConnection.current?.close();
    navigate(-1);
  };

  useEffect(() => {
    if (roomName !== myName && !permit && peerConnection.current) {
      socket.emit('permit_call', roomName, () => {
        setPermit(true);
      });
    }
  }, [permit, peerConnection]);

  return { permitCall, cancelCall, endCall };
};

export default useCallConnect;
