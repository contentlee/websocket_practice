import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';

import { chatSocket } from '@socket';

import { userAtom } from '@atoms/userAtom';

import VideoCallIcon from '@assets/video_call_icon.svg';

import { Icon } from '@components';

interface Props {
  user: string;
}

const VideoCallButton = ({ user }: Props) => {
  const navigate = useNavigate();

  const { name: room_name } = useRecoilValue(userAtom);

  const handleClickVideoCall = (e: React.MouseEvent) => {
    e.preventDefault();

    const callback = () => {
      navigate(`/video/${room_name}`);
    };
    chatSocket.requireVideoCall(user, room_name, callback);
  };

  return <Icon src={VideoCallIcon} size="small" onClick={handleClickVideoCall} />;
};

export default VideoCallButton;
