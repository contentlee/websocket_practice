import { useContext } from 'react';
import { RefreshButton, VideoSelect } from '../components';
import { DevicesContext, PeerConnectionContext } from '../contexts';
import { palette } from '@utils/palette';

const VideoSettingModal = () => {
  const { peerConnection, myStream, updateStream, refresh } = useContext(PeerConnectionContext);
  const { audioList, videoList } = useContext(DevicesContext);

  return (
    <div
      css={{
        width: '100%',
        minWidth: '290px',
        maxWidth: '370px',
        padding: '24px',
        background: palette.background,
        border: '1.5px solid' + palette.main.blk,
        boxSizing: 'border-box',
      }}
    >
      <RefreshButton refresh={refresh} />
      <br />

      <VideoSelect
        peerConnection={peerConnection}
        stream={myStream}
        list={audioList}
        type="audio"
        label="오디오 기기 선택"
        updateStream={updateStream}
      />
      <br />

      <VideoSelect
        peerConnection={peerConnection}
        stream={myStream}
        list={videoList}
        type="video"
        label="비디오 기기 선택"
        updateStream={updateStream}
      />
    </div>
  );
};

export default VideoSettingModal;
