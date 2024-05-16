import { useContext, useState } from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';

import { userAtom } from '@atoms/userAtom';
import { palette } from '@utils/palette';
import { Modal } from '@components';

import { AudioToggleButton, ExitButton, OptionButton } from '../components';
import { CallSettingModal } from '.';
import { PeerConnectionContext } from '../contexts';

const CallOption = () => {
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
        border: '1.5px solid' + palette.main.blk,
      }}
    >
      <div css={{ display: 'flex', width: '100%' }}>
        <AudioToggleButton css={{ flex: 1 / 3 }} stream={myStream} toggleStream={toggleStream} />
        <OptionButton css={{ flex: 1 / 3 }} openModal={openModal} />
        <ExitButton
          css={{ flex: 1 / 3 }}
          roomName={roomName!}
          userName={userName}
          permit={permit}
          exitCall={exitCall}
        />
        <Modal isOpened={isOpened} closeModal={closeModal}>
          <CallSettingModal />
        </Modal>
      </div>
    </div>
  );
};

export default CallOption;
