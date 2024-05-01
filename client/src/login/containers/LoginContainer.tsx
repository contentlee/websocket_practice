import { useOutletContext } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Socket } from 'socket.io-client';

import { changeUser, userAtom } from '@atoms/userAtom';
import { useAlert } from '@hooks';

import { Input, Button } from '@components';

const LoginContainer = () => {
  const { socket } = useOutletContext<{ socket: Socket }>();

  const [_, setUser] = useRecoilState(userAtom);

  const { addAlert } = useAlert();

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { value } = e.currentTarget[0] as HTMLInputElement;

    if (!value) addAlert('error', '아이디를 입력해주세요!');
    const callback = () => {
      setUser(changeUser(value));
      addAlert('success', '로그인에 성공하였습니다!');
    };

    // 추후 로그인 구현 예정
    socket.emit('login', value, callback);
  };

  return (
    <form
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
