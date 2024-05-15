import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router';

import { changeUser, userAtom } from '@atoms/userAtom';
import { useAlert } from '@hooks';

import { Input, Button } from '@components';
import { login } from '@http/login';

const LoginContainer = () => {
  const navigate = useNavigate();
  const [_, setUser] = useRecoilState(userAtom);

  const { addAlert } = useAlert();

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { value: id } = e.currentTarget[0] as HTMLInputElement;

    if (!id) return addAlert('error', '아이디를 입력해주세요!');

    // TODO: 로그인 구현
    login(id).then(() => {
      setUser(changeUser(id));
      addAlert('success', '로그인에 성공하였습니다!');
      navigate('/');
    });
    // loginSocket.login(id, callback);
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
