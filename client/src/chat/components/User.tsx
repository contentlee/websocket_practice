import { Icon } from '@components';
import { palette } from '@utils/palette';

import CallIcon from '@assets/call_icon.svg';
import VideoCallIcon from '@assets/video_call_icon.svg';

interface Props {
  user: string;
  handleClickCall: (e: React.MouseEvent, user: string) => void;
  handleClickVideoCall: (e: React.MouseEvent, user: string) => void;
}
const User = ({ user, handleClickCall, handleClickVideoCall }: Props) => {
  return (
    <div
      key={user}
      css={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 16px',
        borderTop: '1.5px solid' + palette.main.blk,
        fontSize: '14px',
        fontWeight: 700,
        userSelect: 'none',
      }}
    >
      <span>{user}</span>
      <div
        css={{
          display: 'flex',
          gap: '8px',
        }}
      >
        <Icon src={CallIcon} size="small" onClick={(e) => handleClickCall(e, user)}></Icon>
        <Icon
          src={VideoCallIcon}
          size="small"
          onClick={(e) => handleClickVideoCall(e, user)}
        ></Icon>
      </div>
    </div>
  );
};

export default User;
