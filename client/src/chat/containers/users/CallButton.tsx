import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router';

import { chatSocket } from '@socket';

import CallIcon from '@assets/call_icon.svg';

import { Icon } from '@components';

interface Props {
  user: string;
}

const CallButton = ({ user }: Props) => {
  const navigate = useNavigate();

  const handleClickCall = (e: React.MouseEvent) => {
    e.preventDefault();
    const callback = () => {
      navigate(`/call/${user}`);
    };
    chatSocket.requireCall(user, callback);
  };

  return <Icon src={CallIcon} size="small" onClick={handleClickCall}></Icon>;
};

export default CallButton;
