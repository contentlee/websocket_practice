import { useEffect, useState } from 'react';

import { Select } from '@components';
import { UpdateProps } from '@hooks';

interface Props {
  peerConnection: RTCPeerConnection | null;
  stream: MediaStream | null;
  list?: MediaDeviceInfo[];
  type: 'audio' | 'video';
  updateStream: ({ constrains, type }: UpdateProps) => Promise<MediaStreamTrack | null>;
}

const VideoSelect = ({ stream, list = [], type, updateStream }: Props) => {
  const [selected, setSelected] = useState<MediaStreamTrack>();

  const handleChangeVideo = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const value = e.target.value;
    const notChanged =
      type === 'audio'
        ? stream?.getVideoTracks()[0].getConstraints()
        : stream?.getAudioTracks()[0].getConstraints();
    const constrains =
      type === 'audio'
        ? {
            audio: { deviceId: value },
            video: { ...notChanged },
          }
        : {
            audio: { ...notChanged },
            video: { deviceId: value },
          };
    const track = await updateStream({
      type,
      constrains,
    });
    if (track) setSelected(track);
  };

  useEffect(() => {
    if (!stream) return;
    if (type === 'video') {
      setSelected(stream.getVideoTracks()[0]);
    } else if (type === 'audio') {
      setSelected(stream.getAudioTracks()[0]);
    }
  }, [stream]);

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
