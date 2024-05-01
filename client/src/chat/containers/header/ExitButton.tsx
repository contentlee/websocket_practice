import { useContext } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { Socket } from 'socket.io-client';

import { useRecoilValue } from 'recoil';
import { userAtom } from '@atoms/userAtom';

import ExitIcon from '@assets/exit_icon.svg';

import { Icon } from '@components';

import { TitleContext } from '../../contexts';

const ExitButton = () => {
  const navigate = useNavigate();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const title = useContext(TitleContext);

  const { name: myName } = useRecoilValue(userAtom);

  const handleClickLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('leave_room', title.name, myName, () => {
      navigate('/');
    });
  };

  return <Icon src={ExitIcon} alt="exit" size="small" onClick={handleClickLeave} />;
};

export default ExitButton;
