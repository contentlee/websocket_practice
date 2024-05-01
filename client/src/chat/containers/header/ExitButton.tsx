import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';

import { chatSocket } from '@socket';

import { userAtom } from '@atoms/userAtom';

import ExitIcon from '@assets/exit_icon.svg';

import { Icon } from '@components';

import { TitleContext } from '../../contexts';

const ExitButton = () => {
  const navigate = useNavigate();

  const title = useContext(TitleContext);

  const { name: user_name } = useRecoilValue(userAtom);

  const handleClickLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    const callback = () => {
      navigate('/');
    };
    chatSocket.leavRoom(title.name, user_name, callback);
  };

  return <Icon src={ExitIcon} alt="exit" size="small" onClick={handleClickLeave} />;
};

export default ExitButton;
