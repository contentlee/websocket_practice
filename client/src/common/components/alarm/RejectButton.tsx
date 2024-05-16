import { MouseEvent } from 'react';

import { palette } from '@utils/palette';

import Icon from '../Icon';

import CallRejectIcon from '@assets/call_reject_icon.svg';
import CancelIcon from '@assets/close_icon.svg';

interface Props {
  type: 'call' | 'video';
  cancelCall: () => void;
}

const RejectButton = ({ type, cancelCall }: Props) => {
  const handleClickCancel = (e: MouseEvent) => {
    e.preventDefault();
    cancelCall();
  };
  return (
    <div
      css={{
        position: 'absolute',
        right: 0,
        bottom: '16px',
        padding: '16px',
        borderRadius: 50,
        background: palette.point.red,
        boxShadow: '2px 2px 10px 1px rgba(0,0,0,.2)',
        overflow: 'hidden',
      }}
    >
      <Icon src={type === 'call' ? CallRejectIcon : CancelIcon} onClick={handleClickCancel}></Icon>
    </div>
  );
};

export default RejectButton;
