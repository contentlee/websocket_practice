import { useEffect, useState } from 'react';

import { Select } from '@components';
import { UpdateProps } from '@hooks';

interface Props {
  audioList: MediaDeviceInfo[];
  stream: MediaStream | null;
  label?: string;
  updateStream: ({ constrains, type }: UpdateProps) => Promise<MediaStreamTrack | null>;
}
const AudioSelect = ({ audioList, stream, label, updateStream }: Props) => {
  const [selectedAudio, setSelectedAudio] = useState<MediaStreamTrack>();

  const handleChangeAudio = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const value = e.target.value;
    const constrains = { audio: { deviceId: value } };
    const track = await updateStream({
      type: 'audio',
      constrains,
    });
    if (track) setSelectedAudio(track);
  };
  useEffect(() => {
    const track = stream?.getAudioTracks();
    if (track) setSelectedAudio(track[0]);
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
      <Select defaultValue={selectedAudio?.id} option={audioList} onChange={handleChangeAudio} />
    </div>
  );
};

export default AudioSelect;
