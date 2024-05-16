import { useContext } from 'react';

import { AudioSelect, RefreshButton } from '../components';
import { DevicesContext, PeerConnectionContext } from '../contexts';
import { palette } from '@utils/palette';

const CallSettingModal = () => {
  const { myStream, updateStream, refresh } = useContext(PeerConnectionContext);
  const { audioList } = useContext(DevicesContext);

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
      <AudioSelect
        audioList={audioList}
        stream={myStream}
        label="오디오 기기 선택"
        updateStream={updateStream}
      />
    </div>
  );
};

export default CallSettingModal;
