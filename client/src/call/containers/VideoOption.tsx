import { useContext, useState } from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';

import { PeerConnectionContext } from '../contexts';
import { AudioToggleButton, ExitButton, OptionButton, VideoToggleButton } from '../components';
import { VideoSettingModal } from '.';

import { userAtom } from '@atoms/userAtom';
import { Modal } from '@components';

const VideoOption = () => {
  const { name: roomName } = useParams();
  const { name: userName } = useRecoilValue(userAtom);

  const { myStream, permit, toggleStream, exitCall } = useContext(PeerConnectionContext);

  const [isOpened, setOpened] = useState(false);

  const openModal = () => {
    setOpened(true);
  };

  const closeModal = () => {
    setOpened(false);
  };
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
      <div css={{ display: 'flex', width: '100%' }}>
        <VideoToggleButton css={{ flex: 1 / 4 }} stream={myStream} toggleStream={toggleStream} />
        <AudioToggleButton css={{ flex: 1 / 4 }} stream={myStream} toggleStream={toggleStream} />
        <OptionButton css={{ flex: 1 / 4 }} openModal={openModal} />
        <ExitButton
          css={{ flex: 1 / 4 }}
          roomName={roomName!}
          userName={userName}
          permit={permit}
          exitCall={exitCall}
        />
      </div>
      <Modal isOpened={isOpened} closeModal={closeModal}>
        <VideoSettingModal />
      </Modal>
    </div>
  );
};

export default VideoOption;
