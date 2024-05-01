import { useContext } from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';

import { AudioSelect, AudioToggleButton, ExitButton } from '../components';
import { DevicesContext, PeerConnectionContext } from '../contexts';

import { userAtom } from '@atoms/userAtom';
import { palette } from '@utils/palette';

const CallOption = () => {
  const { name: roomName } = useParams();
  const { name: userName } = useRecoilValue(userAtom);

  const { stream, updateStream, toggleStream, exitCall } = useContext(PeerConnectionContext);
  const { audioList } = useContext(DevicesContext);
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
        border: '1.5px solid' + palette.main.blk,
      }}
    >
      <AudioSelect audioList={audioList} stream={stream} updateStream={updateStream} />
      <div css={{ display: 'flex', width: '100%', borderTop: '1.5px solid' + palette.main.blk }}>
        <AudioToggleButton css={{ flex: 1 / 2 }} stream={stream} toggleStream={toggleStream} />
        <ExitButton
          css={{ flex: 1 / 2 }}
          roomName={roomName!}
          userName={userName}
          exitCall={exitCall}
        />
      </div>
    </div>
  );
};

export default CallOption;
