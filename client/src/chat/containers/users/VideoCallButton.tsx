import { Socket } from 'socket.io-client';
import { useNavigate, useOutletContext } from 'react-router';
import { useRecoilValue, useResetRecoilState } from 'recoil';

import { userAtom } from '@atoms/userAtom';

import VideoCallIcon from '@assets/video_call_icon.svg';

import { Icon } from '@components';

interface Props {
  user: string;
}

const VideoCallButton = ({ user }: Props) => {
  const navigate = useNavigate();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const { name: myName } = useRecoilValue(userAtom);

  const handleClickVideoCall = (e: React.MouseEvent) => {
    e.preventDefault();

    const callback = () => {
      navigate(`/video/${myName}`);
    };
    socket.emit('require_video_call', user, myName, callback);
  };

  return <Icon src={VideoCallIcon} size="small" onClick={handleClickVideoCall} />;
};

export default VideoCallButton;
