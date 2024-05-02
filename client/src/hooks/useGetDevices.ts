import { useEffect, useState } from 'react';
import useAlert from './useAlert';

const DEFAULT_CONSTRAINS = {
  audioinput: { audio: true },
  videoinput: { audio: true, video: true },
  audiooutput: {},
};

const useGetDevices = (type: 'audio' | 'video') => {
  const { addAlert } = useAlert();

  const [audioList, setAudioList] = useState<MediaDeviceInfo[]>([]);
  const [videoList, setVideoList] = useState<MediaDeviceInfo[]>([]);

  // REF: 최근 크롬에서는 https 요청이 아닌 경우 mediaDevices에 접근하지 못하도록 함.
  const getConnectedDevices = async (type: MediaDeviceKind) => {
    const devices = await navigator.mediaDevices?.enumerateDevices();
    if (devices) return devices.filter((device) => device.kind === type);

    let list: MediaDeviceInfo[] = [];
    const constrains = DEFAULT_CONSTRAINS[type] as MediaStreamConstraints;
    navigator.mediaDevices
      .getUserMedia(constrains)
      .then(async () => {
        const devices = await navigator.mediaDevices?.enumerateDevices();
        list = devices.filter((device) => device.kind === type);
      })
      .catch(() => {
        addAlert('warning', '기기접근 권한이 없습니다.');
      });
    return list;
  };

  const updateDeviceList = async (type: 'audio' | 'video') => {
    const audioDevices = await getConnectedDevices('audioinput');
    setAudioList(audioDevices);

    if (type === 'video') {
      const videoDevices = await getConnectedDevices('videoinput');
      setVideoList(videoDevices);
    }
  };

  const init = () => {
    try {
      updateDeviceList(type);

      // 기기 변경사항 수신대기
      navigator.mediaDevices.addEventListener('devicechange', () => {
        try {
          updateDeviceList(type);
        } catch (err) {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    init();
  }, []);

  if (type === 'audio') return { audioList };
  return { videoList, audioList, init };
};

export default useGetDevices;
