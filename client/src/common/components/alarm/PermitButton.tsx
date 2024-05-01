import { palette } from '@utils/palette';
import Icon from '../Icon';

import CallIcon from '@assets/call_icon_wht.svg';
import VideoCallIcon from '@assets/video_call_icon_wht.svg';

interface Props {
  type: 'call' | 'video';
  permitCall: () => void;
}
const PermitButton = ({ type, permitCall }: Props) => {
  const handleClickPermit = (e: React.MouseEvent) => {
    e.preventDefault();
    permitCall();
  };

  return (
    <div
      css={{
        position: 'absolute',
        left: 0,
        bottom: '16px',
        padding: '16px',
        borderRadius: 50,
        background: palette.point.green,
        boxShadow: '2px 2px 10px 1px rgba(0,0,0,.2)',
        overflow: 'hidden',
      }}
    >
      <Icon src={type === 'call' ? CallIcon : VideoCallIcon} onClick={handleClickPermit}></Icon>
    </div>
  );
};

export default PermitButton;
