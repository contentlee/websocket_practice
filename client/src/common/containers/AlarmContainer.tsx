import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import { produce } from 'immer';
import { Socket } from 'socket.io-client';

import CallIcon from '@assets/call_icon_wht.svg';
import CallRejectIcon from '@assets/call_reject_icon.svg';
import CancelIcon from '@assets/close_icon.svg';
import VedioCallIcon from '@assets/video_call_icon_wht.svg';

import { alarmAtom } from '@atoms/stateAtom';
import { palette } from '@utils/palette';
import { useAnimate } from '@hooks';

import Icon from '../components/Icon';

interface Props {
  socket: Socket;
}

const AlarmContainer = ({ socket }: Props) => {
  const navigate = useNavigate();

  const [animation, setAnimation] = useAnimate();

  const [alarm, setAlarm] = useRecoilState(alarmAtom);
  const [name, setName] = useState('');

  const handleClickPermit = (e: React.MouseEvent) => {
    e.preventDefault();

    setAnimation({
      type: 'closeAlarm',
      time: 600,
      callback: () => {
        setAlarm((prev) =>
          produce(prev, (draft) => {
            draft.isOpened = false;
            return draft;
          }),
        );
        setAnimation({ type: 'showAlarm', time: 600, callback: () => {} });
        navigate(`/${alarm.type}/${name}`);
      },
    });
  };
  const handleClickCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('cancel_call', name, () => {
      setAnimation({
        type: 'closeAlarm',
        time: 600,
        callback: () => {
          setAlarm((prev) =>
            produce(prev, (draft) => {
              draft.isOpened = false;
              return draft;
            }),
          );
          setAnimation({ type: 'showAlarm', time: 600, callback: () => {} });
        },
      });
    });
  };

  useEffect(() => {
    setAnimation({ type: 'showAlarm', time: 600, callback: () => {} });
  }, [setAnimation]);

  useEffect(() => {
    const requireCall = (userName: string) => {
      setAlarm({ isOpened: true, type: 'call' });
      setName(userName);
    };

    const requireVideoCall = (userName: string) => {
      setAlarm({ isOpened: true, type: 'video' });
      setName(userName);
    };

    socket.on('require_call', requireCall);
    socket.on('require_video_call', requireVideoCall);
  }, [setAlarm, socket]);

  return (
    alarm.isOpened &&
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
            <Icon
              src={alarm.type === 'call' ? CallIcon : VedioCallIcon}
              onClick={handleClickPermit}
            ></Icon>
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
            <Icon
              src={alarm.type === 'call' ? CallRejectIcon : CancelIcon}
              onClick={handleClickCancel}
            ></Icon>
          </div>
        </div>
      </div>,
      document.body,
      'alarm',
    )
  );
};

export default AlarmContainer;
