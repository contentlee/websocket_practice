import { useEffect, useContext, useRef } from 'react';

import { CallOption } from '.';
import { CallLayout, CallState } from '../components';
import { DevicesContext, PeerConnectionContext } from '../contexts';

const CallContainer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const { callState, peerConnection, registerTrackEvent } = useContext(PeerConnectionContext);
  const { audioList } = useContext(DevicesContext);

  useEffect(() => {
    if (audioRef.current) registerTrackEvent(audioRef.current);
  }, [audioRef.current, peerConnection]);

  return (
    <CallLayout>
      <audio
        autoPlay
        playsInline
        controls={false}
        ref={audioRef}
        css={{
          display: 'none',
        }}
      />

      <CallState state={!audioList.length ? 'need_mic' : callState} />
      <CallOption />
    </CallLayout>
  );
};

export default CallContainer;
