import { HTMLAttributes, ReactNode, useContext } from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';

import { chatSocket } from '@socket';

import { userAtom } from '@atoms/userAtom';

import { palette } from '@utils/palette';

import { HandlerContext } from '../../contexts';

interface Props extends HTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

// TODO : 입력창 세로중앙정렬
// TODO : 메세지 보낸 후 TextArea 크기 원상태 복구
// TODO :
const SendForm = ({ children, ...props }: Props) => {
  // roomName
  const { name: room_name } = useParams();

  const { name: user_name } = useRecoilValue(userAtom);

  const { handleAddMsg } = useContext(HandlerContext);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget[0] as HTMLInputElement;
    const message = target.value;
    if (!message) return;
    const callback = () => {
      handleAddMsg({
        type: 'from',
        date: new Date(),
        msg: message,
        user: user_name,
      });
      target.value = '';
    };
    chatSocket.sendNewMessage(message, room_name!, user_name, callback);
  };

  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        position: 'fixed',
        padding: '10px 0',
        left: 0,
        bottom: 0,
        width: '100%',
        boxSizing: 'border-box',
        background: palette.background,
      }}
    >
      <form
        css={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '5px',
          width: '100%',
          maxWidth: '390px',
          minWidth: '310px',
          boxSizing: 'border-box',
        }}
        onSubmit={handleSubmit}
        {...props}
      >
        {children}
      </form>
    </div>
  );
};

export default SendForm;
