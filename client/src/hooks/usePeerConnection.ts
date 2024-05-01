import { useEffect, useRef, useState } from 'react';

import useAlert from './useAlert';

type TState = 'connect' | 'waiting';
type TType = 'audio' | 'video';

export interface UpdateProps {
  constrains: MediaStreamConstraints;
  type: TType;
}

interface Props {
  iceServerUrl: string | string[];
  type: TType;
}

const DEFAULT_CONSTRAINS: { [index: string]: MediaStreamConstraints } = {
  audio: { audio: true },
  video: { audio: true, video: true },
};

// TODO : useAlert에 대한 의존성 없애기
const usePeerConnect = ({ iceServerUrl, type }: Props) => {
  const { addAlert } = useAlert();

  const peerConnection = useRef<RTCPeerConnection>(
    new RTCPeerConnection({
      iceServers: [{ urls: iceServerUrl }],
    }),
  );
  const stream = useRef<MediaStream | null>(null);
  const senders = useRef<RTCRtpSender[]>([]);

  const [permit, setPermit] = useState(false);
  const [callState, setCallState] = useState<TState>('waiting');

  const changePermit = (bool: boolean) => {
    setPermit(bool);
  };

  const resetTrack = () => {
    if (stream.current) {
      const tracks = stream.current.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
    if (peerConnection.current) {
      senders.current.forEach((sender) => {
        peerConnection.current?.removeTrack(sender);
      });
      peerConnection.current.close();
    }

    setCallState('waiting');
    setPermit(false);
  };

  const receivePermit = () => {
    setPermit(true);
    addAlert('success', '상대방과의 연결을 시작합니다.');
  };

  const createOffer = async () => {
    if (!peerConnection.current) return null;
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    return offer;
  };

  const receiveOffer = async (offer: RTCSessionDescriptionInit) => {
    try {
      if (!peerConnection.current || peerConnection.current.signalingState === 'closed')
        throw new Error();
      setPermit(true);
      await peerConnection.current.setRemoteDescription(offer);
      addAlert('success', '상대방과의 연결을 시작합니다.');
      setCallState('connect');
    } catch (err) {
      console.log(err);
    }
  };

  const createAnswer = async () => {
    if (!peerConnection.current) return null;
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    return answer;
  };

  const receiveAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnection.current || peerConnection.current.signalingState === 'closed') return null;

    try {
      await peerConnection.current.setRemoteDescription(answer);
      setCallState('connect');
    } catch (err) {
      console.log(err);
    }
  };

  const getMedia = async (constrains: MediaStreamConstraints) => {
    return await navigator.mediaDevices.getUserMedia(constrains);
  };

  const getSender = (type: TType) => {
    if (!peerConnection.current) return null;
    return peerConnection.current.getSenders().find((sender) => sender.track?.kind === type);
  };

  const setSender = (mediaStream: MediaStream, sender: RTCRtpSender) => {
    if (!mediaStream) return null;
    sender.replaceTrack(mediaStream.getTracks()[0]);
  };

  const setTrack = (mediaStream: MediaStream, type: TType) => {
    if (!mediaStream) return null;
    if (type === 'video') {
      mediaStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }

    mediaStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    mediaStream.getTracks().forEach((track) => {
      if (!peerConnection.current) return;
      const RTCRtpSender = peerConnection.current.addTrack(track, mediaStream);
      if (RTCRtpSender) senders.current.push(RTCRtpSender);
    });
  };

  const updateStream = async ({ constrains, type }: UpdateProps) => {
    const mediaStream = await getMedia(constrains);
    const deviceSender = getSender(type);
    if (deviceSender) setSender(mediaStream, deviceSender);
    setTrack(mediaStream, type);
    stream.current = mediaStream;

    return mediaStream.getTracks();
  };

  const registerTrackEvent = (element: HTMLAudioElement | HTMLVideoElement) => {
    if (!peerConnection.current) return null;
    peerConnection.current.addEventListener('track', (e: RTCTrackEvent) => {
      if (element) {
        console.log(e);
        element.srcObject = e.streams[0];
        element.play();
      }
    });
  };

  const toggleStream = (type: TType) => {
    let flag: boolean = false;
    if (type === 'video') {
      stream.current?.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        flag = track.enabled;
      });
    } else {
      stream.current?.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        flag = track.enabled;
      });
    }

    return flag;
  };

  const registerIcecandidateEvent = (callback: (e: RTCPeerConnectionIceEvent) => void) => {
    if (!peerConnection.current) return null;
    peerConnection.current.addEventListener('icecandidate', callback);
  };

  const setIcecandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      await peerConnection.current?.addIceCandidate(candidate);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    updateStream({ constrains: DEFAULT_CONSTRAINS, type });
  }, []);

  return {
    peerConnection: peerConnection.current,
    stream: stream.current,
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
  };
};

export default usePeerConnect;
