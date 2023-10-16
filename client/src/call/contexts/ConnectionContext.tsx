import { createContext, useRef, useEffect, useState } from 'react';
import { useLocation, useOutletContext, useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import { Socket } from 'socket.io-client';

import { alertAtom } from '@atoms/stateAtom';

import { getDevices, getMedia } from '../helpers/connection';

interface Connection {
  audioRef: React.RefObject<HTMLAudioElement>;
  audioList: MediaDeviceInfo[];
  myVideoRef: React.RefObject<HTMLVideoElement>;
  peerVideoRef: React.RefObject<HTMLVideoElement>;
  videoList: MediaDeviceInfo[];
  stream: React.MutableRefObject<MediaStream | null>;
  peerConnection: React.MutableRefObject<RTCPeerConnection | null>;
}
export const Connection = createContext<Connection>({
  audioRef: { current: null },
  audioList: [],
  myVideoRef: { current: null },
  peerVideoRef: { current: null },
  videoList: [],
  stream: { current: null },
  peerConnection: { current: null },
});

const ConnectionContext = ({ children }: { children: React.ReactNode }) => {
  // common/AlarmContainer
  const { socket } = useOutletContext<{ socket: Socket }>();

  // room name
  const { pathname } = useLocation();
  const { name } = useParams();

  // common UI
  const [_, setAlert] = useRecoilState(alertAtom);

  const stream = useRef<MediaStream | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioList, setAudioList] = useState<MediaDeviceInfo[]>([]);

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const [videoList, setVideoList] = useState<MediaDeviceInfo[]>([]);

  // connection init
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const videoInit = async () => {
      try {
        const audioDevices = await getDevices('audioinput');
        const videoDevices = await getDevices('videoinput');

        navigator.mediaDevices.addEventListener('devicechange', async (e) => {
          try {
            const audioDevices = await getDevices('audioinput');
            const videoDevices = await getDevices('videoinput');
            setAudioList(audioDevices);
            setVideoList(videoDevices);
          } catch (err) {
            console.log(err);
          }
        });

        const constrains = { audio: true, video: true };
        const mediaStream = await getMedia(constrains);

        const connection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });
        mediaStream.getTracks().forEach((track) => {
          // track.stop();
          connection.addTrack(track, mediaStream);
        });

        const handleIcecandidate = (data: RTCPeerConnectionIceEvent) => {
          socket.emit('icecandidate', name, data.candidate);
        };
        connection.addEventListener('icecandidate', handleIcecandidate);

        const handleTrack = (e: RTCTrackEvent) => {
          if (peerVideoRef.current && e.track.kind === 'video') {
            peerVideoRef.current.srcObject = e.streams[0];
          }
        };

        if (myVideoRef.current) myVideoRef.current.srcObject = mediaStream;

        connection.addEventListener('track', handleTrack);
        peerConnection.current = connection;
        stream.current = mediaStream;
        setAudioList(audioDevices);
        setVideoList(videoDevices);
      } catch (err) {
        console.log(err);
      }
    };

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
    pathname.split('/')[1] === 'video' ? videoInit() : audioInit();
  }, [name, socket, pathname, setAlert]);

  return (
    <Connection.Provider
      value={{
        peerConnection,
        audioList,
        myVideoRef,
        peerVideoRef,
        videoList,
        stream,
        audioRef,
      }}
    >
      {children}
    </Connection.Provider>
  );
};

export default ConnectionContext;
