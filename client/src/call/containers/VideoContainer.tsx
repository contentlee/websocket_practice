import { useContext } from 'react';

import { PeerConnectionContext } from '../contexts';
import VideoOption from './VideoOption';
import { CallLayout, MyVideo, PeerVideo } from '../components';

const VideoContainer = () => {
  const { stream, registerTrackEvent } = useContext(PeerConnectionContext);

  return (
    <CallLayout>
      <div
        css={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          marginBottom: '126px',
        }}
      >
        <PeerVideo addTrackEvent={registerTrackEvent} />
        <MyVideo stream={stream} />
      </div>
      <VideoOption />
    </CallLayout>
  );
};

export default VideoContainer;
