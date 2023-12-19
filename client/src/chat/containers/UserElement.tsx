import { useNavigate, useOutletContext } from 'react-router';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { Socket } from 'socket.io-client';

import { modalAtom } from '@atoms/stateAtom';

import { userAtom } from '@atoms/userAtom';
import { User } from '../components';

interface Props {
  user: string;
}

const UserElement = ({ user }: Props) => {
  const navigate = useNavigate();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const { name: myName } = useRecoilValue(userAtom);
  const resetModal = useResetRecoilState(modalAtom);

  const handleChangePage = (path: string) => {
    resetModal();
    navigate(path);
  };

  const handleClickCall = (e: React.MouseEvent, toUserName: string) => {
    e.preventDefault();

    const callback = () => handleChangePage(`/call/` + myName);
    socket.emit('require_call', toUserName, myName, callback);
  };

  const handleClickVideoCall = (e: React.MouseEvent, toUserName: string) => {
    e.preventDefault();

    const callback = () => handleChangePage('/video/' + myName);
    socket.emit('require_video_call', toUserName, myName, callback);
  };
  return (
    <User
      user={user}
      handleClickCall={handleClickCall}
      handleClickVideoCall={handleClickVideoCall}
    />
  );
};

export default UserElement;
