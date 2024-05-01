import { useEffect, useState } from 'react';

import { Select } from '@components';
import { UpdateProps } from '@hooks';

interface Props {
  audioList: MediaDeviceInfo[];
  stream: MediaStream | null;
  updateStream: ({ constrains, type }: UpdateProps) => Promise<MediaStreamTrack[]>;
}
const AudioSelect = ({ audioList, stream, updateStream }: Props) => {
  const [selectedAudio, setSelectedAudio] = useState<MediaStreamTrack>();

  const handleChangeAudio = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const value = e.target.value;
    const constrains = { audio: { deviceId: value } };
    const tracks = await updateStream({
      type: 'audio',
      constrains,
    });
    setSelectedAudio(tracks[0]);
  };
  useEffect(() => {
    const track = stream?.getTracks();
    if (track) setSelectedAudio(track[0]);
  }, []);
  return (
    <Select
      css={{ border: 'none' }}
      defaultValue={selectedAudio?.id}
      option={audioList}
      onChange={handleChangeAudio}
    />
  );
};

export default AudioSelect;
