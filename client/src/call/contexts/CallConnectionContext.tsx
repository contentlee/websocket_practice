import { createContext, useEffect, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import { Socket } from 'socket.io-client';

import { alertAtom } from '@atoms/stateAtom';

import { getDevices, getMedia } from '../helpers/connection';

interface Connection {
  audioRef: React.RefObject<HTMLAudioElement>;
  audioList: MediaDeviceInfo[];
  stream: React.MutableRefObject<MediaStream | null>;
  peerConnection: React.MutableRefObject<RTCPeerConnection | null>;
}

export const CallConnection = createContext<Connection>({
  audioRef: { current: null },
  audioList: [],
  stream: { current: null },
  peerConnection: { current: null },
});

const CallConnectionContext = ({ children }: { children: React.ReactNode }) => {
  // common/AlarmContainer
  const { socket } = useOutletContext<{ socket: Socket }>();

  // room name
  const { name } = useParams();

  // common UI
  const [_, setAlert] = useRecoilState(alertAtom);

  const stream = useRef<MediaStream | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioList, setAudioList] = useState<MediaDeviceInfo[]>([]);

  // connection init
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const audioInit = async () => {
      try {
        const devices = await getDevices('audioinput');
        navigator.mediaDevices.addEventListener('devicechange', async () => {
          try {
            const newAudioList = await getDevices('audioinput');
            setAudioList(newAudioList);
          } catch (err) {
            console.log(err);
          }
        });

        const constrains = { audio: true };
        const mediaStream = await getMedia(constrains);

        const connection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });
        mediaStream.getTracks().forEach((track) => {
          connection.addTrack(track, mediaStream);
        });

        const handleIcecandidate = (data: RTCPeerConnectionIceEvent) => {
          socket.emit('icecandidate', name, data.candidate);
        };
        connection.addEventListener('icecandidate', handleIcecandidate);

        const handleTrack = (e: RTCTrackEvent) => {
          if (audioRef.current) {
            audioRef.current.srcObject = e.streams[0];
            audioRef.current.play();
          }
        };
        connection.addEventListener('track', handleTrack);

        peerConnection.current = connection;
        stream.current = mediaStream;
        setAudioList(devices);
      } catch (err) {
        console.log(err);
      }
    };
    audioInit();
  }, [name, socket, setAlert]);

  return (
    <CallConnection.Provider
      value={{
        peerConnection,
        audioList,
        stream,
        audioRef,
      }}
    >
      {children}
    </CallConnection.Provider>
  );
};

export default CallConnectionContext;
