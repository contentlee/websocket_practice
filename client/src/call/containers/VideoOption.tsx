import { useContext } from 'react';
import { useOutletContext } from 'react-router';
import { Socket } from 'socket.io-client';

import { VideoConnection } from '../contexts';

import { AudioToggleButton, ExitButton, VideoToggleButton } from '../components';
import VideoSelect from '../components/VideoSelect';

const VideoOption = () => {
  const { socket } = useOutletContext<{ socket: Socket }>();

  const { peerConnection, stream, audioList, myVideoRef, videoList } = useContext(VideoConnection);

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
        stream={stream}
        list={audioList}
        ref={myVideoRef}
        type="audio"
      />
      <VideoSelect
        peerConnection={peerConnection}
        stream={stream}
        list={videoList}
        ref={myVideoRef}
        type="video"
      />
      <div css={{ display: 'flex', width: '100%' }}>
        <VideoToggleButton videoRef={myVideoRef} stream={stream} css={{ flex: 1 / 3 }} />
        <AudioToggleButton stream={stream} css={{ flex: 1 / 3 }} />
        <ExitButton css={{ flex: 1 / 3 }} peerConnection={peerConnection} socket={socket} />
      </div>
    </div>
  );
};

export default VideoOption;
