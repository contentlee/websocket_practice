import { Icon } from '@components';
import CallIcon from '@assets/call_icon.svg';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { userAtom } from '@atoms/userAtom';
import { useNavigate, useOutletContext } from 'react-router';
import { Socket } from 'socket.io-client';

interface Props {
  user: string;
}

const CallButton = ({ user }: Props) => {
  const navigate = useNavigate();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const { name: myName } = useRecoilValue(userAtom);

  const handleClickCall = (e: React.MouseEvent) => {
    e.preventDefault();

    const callback = () => {
      navigate(`/call/${myName}`);
    };
    socket.emit('require_call', user, myName, callback);
  };

  return <Icon src={CallIcon} size="small" onClick={handleClickCall}></Icon>;
};

export default CallButton;
