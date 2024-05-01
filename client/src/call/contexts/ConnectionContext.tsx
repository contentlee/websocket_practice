import { userAtom } from '@atoms/userAtom';
import { UpdateProps, useAlert, useGetDevices, usePeerConnect } from '@hooks';
import { callSocket, socket } from '@socket';
import { ReactNode, createContext, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useBeforeUnload } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface PeerConnection {
  peerConnection: RTCPeerConnection | null;
  stream: MediaStream | null;

  callState: 'connect' | 'waiting';
  registerTrackEvent: (element: HTMLAudioElement | HTMLVideoElement) => void;
  updateStream: ({ constrains, type }: UpdateProps) => Promise<MediaStreamTrack[]>;
  toggleStream: (type: 'audio' | 'video') => boolean;
  exitCall: () => void;
}

export const PeerConnectionContext = createContext<PeerConnection>({
  peerConnection: null,
  stream: null,
  callState: 'waiting',
  registerTrackEvent: () => {},
  updateStream: () => new Promise(() => {}),
  toggleStream: () => false,
  exitCall: () => {},
});

interface Devices {
  audioList: MediaDeviceInfo[];
  videoList?: MediaDeviceInfo[];
}
export const DevicesContext = createContext<Devices>({
  audioList: [],
  videoList: [],
});

const ICE_SERVER_URL = 'stun:stun.l.google.com:19302';

const ConnectionContext = ({
  type,
  children,
}: {
  type: 'audio' | 'video';
  children: ReactNode;
}) => {
  const navigate = useNavigate();
  const { addAlert } = useAlert();

  const { name: roomName } = useParams();
  const { name: userName } = useRecoilValue(userAtom);

  const {
    peerConnection,
    stream,
    callState,
    permit,
    receivePermit,
    createOffer,
    receiveOffer,
    createAnswer,
    receiveAnswer,
    updateStream,
    registerTrackEvent,
    resetTrack,
    setIcecandidate,
    registerIcecandidateEvent,
    toggleStream,
    changePermit,
  } = usePeerConnect({
    iceServerUrl: ICE_SERVER_URL,
    type,
  });
  const devices = useGetDevices(type);

  const initPermit = () => {
    if (roomName === userName) return;
    if (!permit && peerConnection) {
      callSocket.sendPermit(roomName!, () => {
        changePermit(true);
      });
    }
  };

  const permitCall = async () => {
    receivePermit();
    const offer = await createOffer();
    if (offer) callSocket.sendOffer(roomName!, offer, () => {});
    else addAlert('error', '연결에 실패하였습니다.');
  };
  const offer = async (description: RTCSessionDescriptionInit) => {
    receiveOffer(description);
    const answer = await createAnswer();
    if (answer) callSocket.sendAnswer(roomName!, answer, () => {});
    else addAlert('error', '연결에 실패하였습니다.');
  };

  const answer = (description: RTCSessionDescriptionInit) => {
    receiveAnswer(description);
  };

  const icecandidate = (candidate: RTCIceCandidateInit) => {
    setIcecandidate(candidate);
  };

  const sendIcecandidate = (data: RTCPeerConnectionIceEvent) => {
    const candidate = data.candidate;
    if (candidate) callSocket.sendIcecandidate(roomName!, candidate, () => {});
  };

  const cancelCall = () => {
    addAlert('warning', '상대방이 통화를 거부하였습니다.');
    resetTrack();
    navigate(-1);
  };

  const endCall = () => {
    addAlert('warning', '상대방이 통화를 종료하였습니다.');
    resetTrack();
    navigate(-1);
  };

  const exitCall = () => {
    resetTrack();
    navigate(-1);
  };

  useEffect(() => {
    initPermit();
    registerIcecandidateEvent(sendIcecandidate);

    // when peer permit your call
    callSocket.permitCall(permitCall).on();
    // when peer send offer
    callSocket.offer(offer).on();
    // when peer send answer
    callSocket.answer(answer).on();
    // when peer send candidate
    callSocket.icecandidate(icecandidate).on();
    // when peer reject your call
    callSocket.cancelCall(cancelCall).on();
    // when peer end call
    callSocket.endCall(endCall).on();

    return () => {
      callSocket.permitCall(permitCall).off();
      callSocket.offer(offer).off();
      callSocket.answer(answer).off();
      callSocket.icecandidate(icecandidate).off();
      callSocket.cancelCall(cancelCall).off();
      callSocket.endCall(endCall).off();
    };
  }, [socket, peerConnection, stream]);

  // 창을 닫게 되는 경우
  useBeforeUnload(
    useCallback(() => {
      callSocket.finishCall(roomName!, userName, () => {});
    }, []),
  );
  return (
    <PeerConnectionContext.Provider
      value={{
        peerConnection,
        stream,
        callState,
        registerTrackEvent,
        updateStream,
        toggleStream,
        exitCall,
      }}
    >
      <DevicesContext.Provider value={devices}>{children}</DevicesContext.Provider>
    </PeerConnectionContext.Provider>
  );
};

export default ConnectionContext;
