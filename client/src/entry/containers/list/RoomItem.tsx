import { HTMLAttributes } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';

import { userAtom } from '@atoms/userAtom';
import { palette } from '@utils/palette';

interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string;
  value: number | string;
  attendee: string[];
  possible: boolean;
}

const RoomItem = ({ name, value, attendee, possible, ...props }: Props) => {
  const navigate = useNavigate();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const { name: myName } = useRecoilValue(userAtom);

  const handleClickRoom = (e: React.MouseEvent) => {
    e.preventDefault();
    if (attendee.includes(myName)) return navigate(`/chat/${name}`);
    const callback = () => navigate(`/chat/${name}`);
    socket.emit('enter_room', name, myName, callback);
  };

  return (
    <div
      onClick={possible ? handleClickRoom : () => {}}
      css={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '42px',
        padding: '5px 20px',
        border: `1.5px solid ${possible ? palette.main.blk : palette.point.red}`,
        boxSizing: 'border-box',
        background: palette.background,
        fontSize: '14px',
        color: palette.main.blk,
        cursor: possible ? 'pointer' : 'none',
        transition: '.1s ease-in-out',
        '&:hover': {
          transform: possible ? 'scale(105%)' : 'scale(100%)',
        },
      }}
      {...props}
    >
      <div css={{ fontWeight: 600 }}>{name}</div>
      <div>({value})</div>
    </div>
  );
};

export default RoomItem;
