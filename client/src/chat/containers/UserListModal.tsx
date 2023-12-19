import { useContext, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import { useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';

import { palette } from '@utils/palette';
import { useAlert } from '@hooks';
import { userAtom } from '@atoms/userAtom';

import { ModalContainer } from '@containers';

import { AttendeeContext } from '../contexts';
import UserElement from './UserElement';

const UserListModal = () => {
  const [_, setAlert] = useAlert();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const { name: myName } = useRecoilValue(userAtom);

  const attendee = useContext(AttendeeContext);

  useEffect(() => {
    const notFoundUser = () => setAlert('error', '사용자가 접속하지 않은 상태입니다.');
    socket.on('not_found_user', notFoundUser);

    return () => {
      socket.off('not_found_user', notFoundUser);
    };
  }, [setAlert, socket]);

  return (
    <ModalContainer name="attendeeList">
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
        }}
      >
        {attendee.map(({ user }) => myName !== user && <UserElement user={user} />)}
      </div>
    </ModalContainer>
  );
};

export default UserListModal;
