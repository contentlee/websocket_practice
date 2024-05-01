import { Select } from '@components';
import { MutableRefObject, RefObject, useEffect, useState } from 'react';
import { getMedia } from '../helpers/connection';

interface Props {
  peerConnection: MutableRefObject<RTCPeerConnection | null>;
  stream: MutableRefObject<MediaStream | null>;
  list: MediaDeviceInfo[];
  ref: RefObject<HTMLVideoElement>;
  type: 'audio' | 'video';
}

const VideoSelect = ({ peerConnection, stream, list, ref, type }: Props) => {
  const [selected, setSelected] = useState<MediaStreamTrack>();

  const handleChangeVideo = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const value = e.target.value;
    const mediaStream = await getMedia({
      video: { deviceId: value },
      audio: { deviceId: selected?.getConstraints().deviceId },
    });

    if (ref.current) ref.current.srcObject = mediaStream;
    setSelected(mediaStream.getVideoTracks()[0]);

    const videoSender = peerConnection.current
      ?.getSenders()
      .find((sender) => sender.track?.kind === type);
    await videoSender?.replaceTrack(mediaStream.getVideoTracks()[0]);

    mediaStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    mediaStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    stream.current = mediaStream;
  };

  useEffect(() => {
    if (type === 'video') setSelected(stream.current?.getVideoTracks()[0]);
    else if (type === 'audio') setSelected(stream.current?.getAudioTracks()[0]);
  }, [stream]);

  return <Select defaultValue={selected?.id} option={list} onChange={handleChangeVideo} />;
};

export default VideoSelect;
