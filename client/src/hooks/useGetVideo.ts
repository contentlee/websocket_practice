import { useEffect, useState } from 'react';

const useGetVideo = () => {
  const [videoList, setVideoList] = useState<MediaDeviceInfo[]>([]);
  const [audioList, setAudioList] = useState<MediaDeviceInfo[]>([]);
  const [mediaStream, setMediaStream] = useState<MediaStream>();

  useEffect(() => {
    const get = async () => {
      try {
        const audioDevices = await getDevices('audioinput');
        const videoDevices = await getDevices('videoinput');

        setAudioList(audioDevices);
        setVideoList(videoDevices);

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
        setMediaStream(await getMedia(constrains));
      } catch (err) {
        console.log(err);
      }
    };
    get();
  }, []);

  return [mediaStream, videoList, audioList];
};

export default useGetVideo;

export const getMedia = async (constrains: MediaStreamConstraints) => {
  return navigator.mediaDevices.getUserMedia(constrains);
};

export const getDevices = async (type: MediaDeviceKind) => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === type);
};
