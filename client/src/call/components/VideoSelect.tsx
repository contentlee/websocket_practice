import { useEffect, useState } from 'react';

import { Select } from '@components';
import { UpdateProps } from '@hooks';

interface Props {
  peerConnection: RTCPeerConnection | null;
  stream: MediaStream | null;
  list?: MediaDeviceInfo[];
  type: 'audio' | 'video';
  updateStream: ({ constrains, type }: UpdateProps) => Promise<MediaStreamTrack[]>;
}

const VideoSelect = ({ stream, list = [], type, updateStream }: Props) => {
  const [selected, setSelected] = useState<MediaStreamTrack>();

  const handleChangeVideo = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const value = e.target.value;
    const constrains =
      type === 'audio'
        ? {
            audio: { deviceId: value },
            video: { deviceId: stream?.getVideoTracks()[0].getConstraints().deviceId },
          }
        : {
            audio: { deviceId: stream?.getAudioTracks()[0].getConstraints().deviceId },
            video: { deviceId: value },
          };
    const trakcs = await updateStream({
      type,
      constrains,
    });
    setSelected(trakcs[0]);
  };
  useEffect(() => {
    if (!stream) return;
    if (type === 'video') {
      setSelected(stream.getVideoTracks()[0]);
    } else if (type === 'audio') {
      setSelected(stream.getAudioTracks()[0]);
    }
  }, []);

  return (
    <Select
      css={{ border: 'none' }}
      defaultValue={selected?.id}
      option={list}
      onChange={handleChangeVideo}
    />
  );
};

export default VideoSelect;
