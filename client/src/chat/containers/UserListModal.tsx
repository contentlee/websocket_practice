import { useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useOutletContext } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';

import CallIcon from '@assets/call_icon.svg';
import VideoCallIcon from '@assets/video_call_icon.svg';

import { alertAtom, closeModalAction, modalAtom } from '@atoms/stateAtom';
import { userAtom } from '@atoms/userAtom';
import { palette } from '@utils/palette';
import { useAnimate } from '@hooks';
import { Icon } from '@components';

import { AttendeeContext } from '../contexts';

const UserListModal = () => {
  const navigate = useNavigate();
  const [animation, setAnimation] = useAnimate();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const userInfo = useRecoilValue(userAtom);
  const [{ isOpened, type }, setModal] = useRecoilState(modalAtom);
  const [_, setAlert] = useRecoilState(alertAtom);

  const attendee = useContext(AttendeeContext);

  const handleClickCall = (e: React.MouseEvent, toUserName: string) => {
    e.preventDefault();
    socket.emit('require_call', toUserName, userInfo.name, () => {
      setAnimation({
        type: 'fadeOut',
        callback: () => {
          setModal(closeModalAction);
          navigate('/call/' + userInfo.name);
        },
      });
    });
  };

  const handleClickVideoCall = (e: React.MouseEvent, user: string) => {
    e.preventDefault();
    socket.emit('require_video_call', user, userInfo.name, () => {
      setAnimation({
        type: 'fadeOut',
        callback: () => {
          setModal(closeModalAction);
          navigate('/video/' + userInfo.name);
        },
      });
    });
  };

  useEffect(() => {
    setAnimation({ type: 'fadeIn', callback: () => {} });
  }, [setAnimation]);

  useEffect(() => {
    const notFoundUser = () => {
      setAlert({
        isOpened: true,
        type: 'error',
        children: '사용자가 접속하지 않은 상태입니다.',
      });
    };

    socket.on('not_found_user', notFoundUser);

    return () => {
      socket.off('not_found_user', notFoundUser);
    };
  }, [setAlert, socket]);

  return (
    isOpened &&
    type === 'attendeeList' &&
    createPortal(
      <div
        css={{
          zIndex: 1000,
          position: 'absolute',
          top: '20px',
          width: '100%',
          minWidth: '290px',
          maxWidth: '370px',
          paddingTop: '20px',
          border: '1.5px solid' + palette.main.blk,
          background: palette.background,
          animation: animation ? animation + '.2s forwards ease-out' : '',
        }}
      >
        {attendee.map(({ user }) => {
          return (
            <div
              key={user}
              css={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 16px',
                borderTop: '1.5px solid' + palette.main.blk,
                fontSize: '14px',
                fontWeight: 700,
                userSelect: 'none',
              }}
            >
              <span>{user}</span>
              {user !== userInfo.name && (
                <div
                  css={{
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <Icon
                    src={CallIcon}
                    size="small"
                    onClick={(e) => handleClickCall(e, user)}
                  ></Icon>
                  <Icon
                    src={VideoCallIcon}
                    size="small"
                    onClick={(e) => handleClickVideoCall(e, user)}
                  ></Icon>
                </div>
              )}
            </div>
          );
        })}
      </div>,
      document.body,
      'userListModal',
    )
  );
};

export default UserListModal;
