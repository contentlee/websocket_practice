import { useContext } from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';

import { DevicesContext, PeerConnectionContext } from '../contexts';
import { AudioToggleButton, ExitButton, VideoSelect, VideoToggleButton } from '../components';
import { userAtom } from '@atoms/userAtom';

const VideoOption = () => {
  const { name: roomName } = useParams();
  const { name: userName } = useRecoilValue(userAtom);

  const { peerConnection, myStream, updateStream, toggleStream, exitCall } =
    useContext(PeerConnectionContext);
  const { audioList, videoList } = useContext(DevicesContext);

  return (
    <div
      css={{
        zIndex: 1000,
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        width: '100%',
        maxWidth: '390px',
        minWidth: '310px',
        boxSizing: 'border-box',
      }}
    >
      <VideoSelect
        peerConnection={peerConnection}
        stream={myStream}
        list={audioList}
        type="audio"
        updateStream={updateStream}
      />
      <VideoSelect
        peerConnection={peerConnection}
        stream={myStream}
        list={videoList}
        type="video"
        updateStream={updateStream}
      />
      <div css={{ display: 'flex', width: '100%' }}>
        <VideoToggleButton css={{ flex: 1 / 3 }} stream={myStream} toggleStream={toggleStream} />
        <AudioToggleButton css={{ flex: 1 / 3 }} stream={myStream} toggleStream={toggleStream} />
        <ExitButton
          css={{ flex: 1 / 3 }}
          roomName={roomName!}
          userName={userName}
          exitCall={exitCall}
        />
      </div>
    </div>
  );
};

export default VideoOption;
