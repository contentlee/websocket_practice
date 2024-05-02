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
}

// TODO : useAlert에 대한 의존성 없애기
const usePeerConnect = ({ iceServerUrl }: Props) => {
  const { addAlert } = useAlert();

  const peerConnection = useRef<RTCPeerConnection>(
    new RTCPeerConnection({
      iceServers: [{ urls: iceServerUrl }],
    }),
  );

  // stream
  const [peerStream, setPeerStream] = useState<MediaStream | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);

  // connecting state
  const [permit, setPermit] = useState(false);
  const [callState, setCallState] = useState<TState>('waiting');
  const [devicePermissionState, setDevicePermissionState] = useState(false);
  const failed = useRef(0);

  // process like handshake
  const changePermit = (bool: boolean) => {
    setPermit(bool);
  };

  const receivePermit = () => {
    setPermit(true);
    addAlert('success', '상대방과의 연결을 시작합니다.');
  };

  const createOffer = async () => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    return offer;
  };

  const receiveOffer = async (offer: RTCSessionDescriptionInit) => {
    try {
      if (peerConnection.current.signalingState === 'closed') throw new Error();
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
    if (peerConnection.current.signalingState === 'closed') return null;

    try {
      await peerConnection.current.setRemoteDescription(answer);
      setCallState('connect');
    } catch (err) {
      console.log(err);
    }
  };

  // setting Stream
  const getMedia = async (constrains: MediaStreamConstraints) => {
    return await navigator.mediaDevices
      .getUserMedia(constrains)
      .then((stream) => {
        setDevicePermissionState(true);
        return stream;
      })
      .catch(() => {
        addAlert('warning', '기기에 대한 권한이 허용되지 않았습니다.');
        setDevicePermissionState(false);
        return null;
      });
  };

  const initSender = async (mediaStream: MediaStream) => {
    mediaStream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, mediaStream);
    });
  };

  const getSenders = () => {
    return peerConnection.current.getSenders();
  };

  const removeSender = () => {
    const senders = peerConnection.current.getSenders();
    senders.forEach((sender) => {
      peerConnection.current.removeTrack(sender);
    });
  };

  const resetTrack = () => {
    if (myStream) {
      const tracks = myStream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
    removeSender();
    peerConnection.current.close();

    setCallState('waiting');
    setPermit(false);
  };

  const replaceSender = async (mediaStream: MediaStream, senders: RTCRtpSender[]) => {
    // 특정 트랙만 교체할시 다른 트랙이 삭제되는 현상으로 인해 sender의 모든 track을 교체한다.
    mediaStream.getTracks().forEach((track) => {
      senders.forEach((sender) => {
        if (sender.track?.kind === track.kind) {
          sender.replaceTrack(track);
        }
      });
    });
  };

  const initStream = async (mediaStream: MediaStream) => {
    initSender(mediaStream);
    setMyStream(mediaStream);

    return mediaStream;
  };

  const updateStream = async ({ constrains, type }: UpdateProps) => {
    const mediaStream = await getMedia(constrains);
    if (!mediaStream) return null;
    const senders = getSenders();
    if (!senders.length) initStream(mediaStream);
    else replaceSender(mediaStream, senders);
    setMyStream(mediaStream);

    const track = mediaStream.getTracks().filter((t) => t.kind === type)[0];
    return track;
  };

  const toggleStream = (type: TType) => {
    if (!myStream) return false;
    let flag: boolean = false;
    if (type === 'video') {
      myStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        flag = track.enabled;
      });
    } else {
      myStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        flag = track.enabled;
      });
    }

    return flag;
  };

  const registerTrackEvent = () => {
    peerConnection.current.addEventListener('track', (e: RTCTrackEvent) => {
      setPeerStream(e.streams[0]);
    });
  };

  const registerIcecandidateEvent = (callback: (e: RTCPeerConnectionIceEvent) => void) => {
    peerConnection.current.addEventListener('icecandidate', callback);
  };

  const registerRestartIcecandidateEvent = (
    restartCallback: (...arg: any) => void,
    endCallback: (...arg: any) => void,
  ) => {
    peerConnection.current.addEventListener('iceconnectionstatechange', (e) => {
      if (failed.current > 3) {
        endCallback();
      }
      const state = peerConnection.current.iceConnectionState;

      if (state === 'failed') {
        failed.current += 1;
        peerConnection.current.restartIce();
        restartCallback();
      } else if (state === 'completed') {
        failed.current = 0;
      }
    });
  };

  // TODO: 기기 추가 및 삭제시 발생하는 이벤트
  const registerChangeDeviceEvent = () => {
    navigator.mediaDevices.addEventListener('devicechange', (e) => {
      // console.log(e);
    });
  };

  const setIcecandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      await peerConnection.current.addIceCandidate(candidate);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    peerConnection: peerConnection.current,
    myStream: myStream,
    peerStream: peerStream,
    callState,
    permit,
    devicePermissionState,
    receivePermit,
    createOffer,
    receiveOffer,
    createAnswer,
    receiveAnswer,
    updateStream,
    resetTrack,
    registerTrackEvent,
    setIcecandidate,
    registerIcecandidateEvent,
    registerRestartIcecandidateEvent,
    registerChangeDeviceEvent,
    toggleStream,
    changePermit,
  };
};

export default usePeerConnect;
