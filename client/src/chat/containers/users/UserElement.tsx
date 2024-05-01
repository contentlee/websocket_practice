import { CallButton, VideoCallButton } from '.';
import { palette } from '@utils/palette';

interface Props {
  user: string;
}

const UserElement = ({ user }: Props) => {
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
        <CallButton user={user} />
        <VideoCallButton user={user} />
      </div>
    </div>
  );
};

export default UserElement;
