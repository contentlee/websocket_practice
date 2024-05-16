import { useEffect, useState } from 'react';

import { Select } from '@components';
import { UpdateProps } from '@hooks';

interface Props {
  peerConnection: RTCPeerConnection | null;
  stream: MediaStream | null;
  list?: MediaDeviceInfo[];
  type: 'audio' | 'video';
  label?: string;
  updateStream: ({ constrains, type }: UpdateProps) => Promise<MediaStreamTrack | null>;
}

const VideoSelect = ({ stream, list = [], type, label, updateStream }: Props) => {
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
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {label && (
        <label
          css={{
            fontSize: '14px',
            fontWeight: 600,
            padding: '0 10px',
          }}
        >
          {label}
        </label>
      )}
      <Select defaultValue={selected?.id} option={list} onChange={handleChangeVideo} />
    </div>
  );
};

export default VideoSelect;
