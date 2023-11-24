import { useOutletContext } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import { changeUser } from '@atoms/userAtom';
import { useAnimate } from '@hooks';
import { Input, Button } from '@components';

const LoginContainer = () => {
  const [ref, setAnimation] = useAnimate<HTMLFormElement>();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { value } = e.currentTarget[0] as HTMLInputElement;
    const callback = () => setAnimation('fadeOut', () => changeUser(value));

    // 추후 로그인 구현 예정
    socket.emit('login', value, callback);
  };

  return (
    <form
      ref={ref}
      onSubmit={handleNameSubmit}
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
      }}
    >
      <Input label="당신의 이름을 입력하세요." css={{ width: '100%' }}></Input>
      <Button type="submit">채팅 참여하기</Button>
    </form>
  );
};

export default LoginContainer;
