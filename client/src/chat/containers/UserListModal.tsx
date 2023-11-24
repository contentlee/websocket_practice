import { useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useOutletContext } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';

import CallIcon from '@assets/call_icon.svg';
import VideoCallIcon from '@assets/video_call_icon.svg';

import { closeModalAction, modalAtom } from '@atoms/stateAtom';
import { userAtom } from '@atoms/userAtom';
import { palette } from '@utils/palette';
import { useAlert, useAnimate } from '@hooks';
import { Icon } from '@components';

import { AttendeeContext } from '../contexts';

const UserListModal = () => {
  const navigate = useNavigate();
  const [ref, setAnimation] = useAnimate<HTMLDivElement>();
  const [_, setAlert] = useAlert();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const { name } = useRecoilValue(userAtom);
  const [{ isOpened, type }, setModal] = useRecoilState(modalAtom);

  const attendee = useContext(AttendeeContext);

  const handleChangePage = (path: string) => {
    setModal(closeModalAction);
    navigate(path);
  };

  const handleClickCall = (e: React.MouseEvent, toUserName: string) => {
    e.preventDefault();

    const callback = () => setAnimation('fadeOut', () => handleChangePage(`/call/` + name));
    socket.emit('require_call', toUserName, name, callback);
  };

  const handleClickVideoCall = (e: React.MouseEvent, user: string) => {
    e.preventDefault();

    const callback = () => setAnimation('fadeOut', () => handleChangePage('/video/' + name));
    socket.emit('require_video_call', user, name, callback);
  };

  useEffect(() => {
    setAnimation('fadeIn');
  }, [setAnimation]);

  useEffect(() => {
    const notFoundUser = () => setAlert('error', '사용자가 접속하지 않은 상태입니다.');
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
        ref={ref}
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
              {user !== name && (
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
