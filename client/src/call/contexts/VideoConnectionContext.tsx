import { createContext, useRef, useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import { Socket } from 'socket.io-client';

import { alertAtom } from '@atoms/stateAtom';

import { getDevices, getMedia } from '../helpers/connection';

interface Connection {
  myVideoRef: React.RefObject<HTMLVideoElement>;
  peerVideoRef: React.RefObject<HTMLVideoElement>;
  audioList: MediaDeviceInfo[];
  videoList: MediaDeviceInfo[];
  stream: React.MutableRefObject<MediaStream | null>;
  peerConnection: React.MutableRefObject<RTCPeerConnection | null>;
}
export const VideoConnection = createContext<Connection>({
  myVideoRef: { current: null },
  peerVideoRef: { current: null },
  audioList: [],
  videoList: [],
  stream: { current: null },
  peerConnection: { current: null },
});

const VideoConnectionContext = ({ children }: { children: React.ReactNode }) => {
  // common/AlarmContainer
  const { socket } = useOutletContext<{ socket: Socket }>();

  // room name
  const { name } = useParams();

  // common UI
  const [_, setAlert] = useRecoilState(alertAtom);

  const stream = useRef<MediaStream | null>(null);

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const [videoList, setVideoList] = useState<MediaDeviceInfo[]>([]);
  const [audioList, setAudioList] = useState<MediaDeviceInfo[]>([]);

  // connection init
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const videoInit = async () => {
      try {
        const audioDevices = await getDevices('audioinput');
        const videoDevices = await getDevices('videoinput');

        navigator.mediaDevices.addEventListener('devicechange', async () => {
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

    videoInit();
  }, [name, socket, setAlert]);

  return (
    <VideoConnection.Provider
      value={{
        peerConnection,
        audioList,
        myVideoRef,
        peerVideoRef,
        videoList,
        stream,
      }}
    >
      {children}
    </VideoConnection.Provider>
  );
};

export default VideoConnectionContext;
