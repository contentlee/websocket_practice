import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { Socket } from 'socket.io-client';

import CallIcon from '@assets/call_icon_wht.svg';
import CallRejectIcon from '@assets/call_reject_icon.svg';
import CancelIcon from '@assets/close_icon.svg';
import VideoCallIcon from '@assets/video_call_icon_wht.svg';

import { palette } from '@utils/palette';
import { useAnimate } from '@hooks';

import { Icon } from '../components';

interface Props {
  socket: Socket;
}

const AlarmContainer = ({ socket }: Props) => {
  const navigate = useNavigate();
  const [animation, setAnimation] = useAnimate();

  const [isOpened, setOpened] = useState(false);
  const [type, setType] = useState<'call' | 'video'>('call');
  const [name, setName] = useState('');

  const handleClickPermit = (e: React.MouseEvent) => {
    e.preventDefault();

    const callback = () => {
      setOpened(false);
      navigate(`/${type}/${name}`);
    };

    setAnimation('closeAlarm', callback, 600);
  };

  const handleClickCancel = (e: React.MouseEvent) => {
    e.preventDefault();

    const closeAlarm = () => setOpened(false);
    const callback = () => setAnimation('closeAlarm', closeAlarm, 600);
    socket.emit('cancel_call', name, callback);
  };

  useEffect(() => {
    setAnimation('showAlarm', () => {}, 600);
  }, [setAnimation]);

  useEffect(() => {
    const requireCall = (userName: string) => {
      setOpened(true);
      setType('call');
      setName(userName);
    };
    socket.on('require_call', requireCall);

    const requireVideoCall = (userName: string) => {
      setOpened(true);
      setType('video');
      setName(userName);
    };
    socket.on('require_video_call', requireVideoCall);

    return () => {
      socket.off('require_call', requireCall);
      socket.off('require_video_call', requireVideoCall);
    };
  }, [socket]);

  return (
    isOpened &&
    createPortal(
      <div
        css={{
          zIndex: 1500,
          position: 'absolute',
          bottom: 0,
        }}
      >
        <div
          css={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '390px',
            minWidth: '310px',
            boxSizing: 'border-box',
          }}
        >
          <div
            css={{
              position: 'absolute',
              left: 0,
              bottom: '16px',
              padding: '16px',
              borderRadius: 50,
              background: palette.point.green,
              boxShadow: '2px 2px 10px 1px rgba(0,0,0,.2)',
              animation: animation + '.5s ease-in forwards',
              overflow: 'hidden',
            }}
          >
            <Icon src={TYPE_ICON[type]['permit']} onClick={handleClickPermit}></Icon>
          </div>
          <div
            css={{
              position: 'absolute',
              right: 0,
              bottom: '16px',
              padding: '16px',
              borderRadius: 50,
              background: palette.point.red,
              boxShadow: '2px 2px 10px 1px rgba(0,0,0,.2)',
              animation: animation + '.5s ease-in forwards',
              overflow: 'hidden',
            }}
          >
            <Icon src={TYPE_ICON[type]['reject']} onClick={handleClickCancel}></Icon>
          </div>
        </div>
      </div>,
      document.body,
      'alarm',
    )
  );
};

const TYPE_ICON = {
  call: {
    permit: CallIcon,
    reject: CallRejectIcon,
  },
  video: {
    permit: VideoCallIcon,
    reject: CancelIcon,
  },
};
export default AlarmContainer;
