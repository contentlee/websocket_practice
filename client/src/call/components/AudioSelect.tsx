import { MutableRefObject, useEffect, useState } from 'react';
import { Select } from '@components';
import { getMedia } from '../helpers/connection';

interface Props {
  peerConnection: MutableRefObject<RTCPeerConnection | null>;
  stream: MutableRefObject<MediaStream | null>;
  audioList: MediaDeviceInfo[];
}
const AudioSelect = ({ peerConnection, stream, audioList }: Props) => {
  const [selectedAudio, setSelectedAudio] = useState<MediaStreamTrack>();

  const handleChangeAudio = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const value = e.target.value;
    const mediaStream = await getMedia({ audio: { deviceId: value } });

    setSelectedAudio(mediaStream.getTracks()[0]);

    const audioSender = peerConnection.current
      ?.getSenders()
      .find((sender) => sender.track?.kind === 'audio');

    await audioSender?.replaceTrack(mediaStream.getTracks()[0]);

    mediaStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    stream.current = mediaStream;
  };

  useEffect(() => {
    setSelectedAudio(stream.current?.getTracks()[0]);
  }, [stream]);
  return (
    <Select defaultValue={selectedAudio?.id} option={audioList} onChange={handleChangeAudio} />
  );
};

export default AudioSelect;
