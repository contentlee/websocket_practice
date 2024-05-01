import { useContext, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { chatSocket } from '@socket';

import { palette } from '@utils/palette';
import { useAlert } from '@hooks';
import { userAtom } from '@atoms/userAtom';

import { AttendeeContext } from '../../contexts';
import { UserElement } from '.';

const UserList = () => {
  const { addAlert } = useAlert();

  const { name: myName } = useRecoilValue(userAtom);

  const attendee = useContext(AttendeeContext);

  useEffect(() => {
    const notFoundUser = () => addAlert('error', '사용자가 접속하지 않은 상태입니다.');
    chatSocket.noFoundUser(notFoundUser).on();

    return () => {
      chatSocket.noFoundUser(notFoundUser).off();
    };
  }, [addAlert, chatSocket]);

  return (
    <div
      css={{
        zIndex: 1000,
        width: '100%',
        minWidth: '290px',
        maxWidth: '370px',
        paddingTop: '20px',
        border: '1.5px solid' + palette.main.blk,
        background: palette.background,
      }}
    >
      {attendee.map((name) => myName !== name && <UserElement key={name} user={name} />)}
    </div>
  );
};

export default UserList;
