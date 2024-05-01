import { HTMLAttributes, ClassAttributes, ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';

import { roomSocket, socket } from '@socket';

import { palette } from '@utils/palette';

import { userAtom } from '@atoms/userAtom';

import { useAlert } from '@hooks';

interface Props extends HTMLAttributes<HTMLFormElement>, ClassAttributes<HTMLFormElement> {
  closeModal: () => void;
  children: ReactNode;
}

const CreateForm = ({ closeModal, children, ...props }: Props) => {
  const navigate = useNavigate();

  const { addAlert } = useAlert();

  const { name: user_name } = useRecoilValue(userAtom);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!socket) return addAlert('warning', '연결이 불안정합니다.');

    const value = (i: number) => (e.currentTarget[i] as HTMLInputElement).value;

    const name = value(0);
    const max_length = parseInt(value(1)) || 100;
    const init_msg = value(2) || '';

    if (!name) return addAlert('warning', '이름이 입력되지 않았습니다.');

    const info = { name, max_length, init_msg };
    const callback = () => {
      addAlert('success', '채팅방 생성에 성공하였습니다!');
      navigate(`/chat/${name}`);
    };
    roomSocket.createRoom(user_name, info, callback);
  };

  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      css={{
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: '290px',
        maxWidth: '370px',
        padding: '20px',
        gap: '16px',
        border: '1.5px solid' + palette.main.blk,
        background: palette.background,
        boxSizing: 'border-box',
      }}
      {...props}
    >
      {children}
    </form>
  );
};

export default CreateForm;
