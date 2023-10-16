import { HTMLAttributes, useContext } from 'react';
import { useOutletContext, useParams } from 'react-router';
import { Socket } from 'socket.io-client';
import { useRecoilValue } from 'recoil';

import { userAtom } from '@atoms/userAtom';
import { Button, Input } from '@components';

import { HandlerContext } from '../contexts/ChatContext';

interface Props extends HTMLAttributes<HTMLFormElement> {}

const SendForm = ({ ...props }: Props) => {
  const { socket } = useOutletContext<{ socket: Socket }>();

  const { name } = useParams();

  const userInfo = useRecoilValue(userAtom);

  const { handleAddMsg } = useContext(HandlerContext);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget[0] as HTMLInputElement;
    if (!target.value) return;
    socket.emit('new_message', target.value, name, userInfo.name, () => {
      handleAddMsg({
        type: 'from',
        date: new Date(),
        msg: target.value,
        user: userInfo.name,
      });
      target.value = '';
    });
  };

  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        boxSizing: 'border-box',
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
        <Input css={{ flex: 1 }}></Input>
        <Button type="submit">보내기</Button>
      </form>
    </div>
  );
};

export default SendForm;
