import { useContext, useEffect, useState } from 'react';

import { PeerConnectionContext } from '../contexts';
import VideoOption from './VideoOption';
import { CallLayout, LoadingVideo, MyVideo, PeerVideo } from '../components';

const VideoContainer = () => {
  const { myStream, peerStream, callState } = useContext(PeerConnectionContext);
  const [peerState, setPeerState] = useState(false);
  const [myState, setMyState] = useState(false);

  useEffect(() => {
    setPeerState(peerStream ? true : false);
    setMyState(myStream ? true : false);
  }, [myStream, peerStream]);

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
        {peerState ? <PeerVideo stream={peerStream} /> : <LoadingVideo callState={callState} />}
        {myState ? <MyVideo stream={myStream} /> : <LoadingVideo callState={callState} />}
      </div>
      <VideoOption />
    </CallLayout>
  );
};

export default VideoContainer;
