import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { useOutletContext } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';

import { closeModalAction, modalAtom } from '@atoms/stateAtom';
import { userAtom } from '@atoms/userAtom';
import { useAlert, useAnimate } from '@hooks';
import { Button, Input, TextArea } from '@components';

import { ModalForm, Title } from '../components';

const CreateRoomModal = () => {
  const navigate = useNavigate();
  const [_, setAlert] = useAlert();
  const [ref, setAnimation] = useAnimate<HTMLFormElement>();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const { name } = useRecoilValue(userAtom);
  const [{ isOpened }, setModal] = useRecoilState(modalAtom);

  const handleChangePage = (path: string) => {
    setModal(closeModalAction);
    navigate(path);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [roomName, maxLength, notification] = [
      (e.currentTarget[0] as HTMLInputElement).value,
      (e.currentTarget[1] as HTMLInputElement).value,
      (e.currentTarget[2] as HTMLInputElement).value,
    ];

    if (!roomName) return;

    const callback = () => setAnimation('fadeOut', () => handleChangePage(`/chat/${roomName}`));

    socket?.emit(
      'create_room',
      roomName,
      maxLength ? maxLength : 100,
      notification,
      name,
      callback,
    );
  };

  const handleClickCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    setModal(closeModalAction);
  };

  useEffect(() => {
    const needLogin = () => {
      setAlert('error', '로그인이 필요합니다.');
      setAnimation('fadeOut', () => navigate('/login'));
    };
    socket.on('need_login', needLogin);

    const duplicatedName = () => {
      setAlert('error', '중복된 채팅방이 존재합니다.');
    };
    socket.on('duplicated_name', duplicatedName);

    return () => {
      socket.off('need_login', needLogin);
      socket.off('duplicated_name', duplicatedName);
    };
  }, [navigate, setAlert, setAnimation, socket]);

  useEffect(() => {
    setAnimation('fadeIn');
  }, [setAnimation]);

  return (
    isOpened &&
    createPortal(
      <ModalForm ref={ref} onSubmit={handleSubmit}>
        <Title type="create">채팅방 생성하기</Title>

        {/* 입력란  */}
        <Input label="이름" css={{ width: '100%' }}></Input>
        <Input type="number" label="최대인원" css={{ width: '100%' }}></Input>
        <TextArea label="첫공지" css={{ width: '100%' }}></TextArea>

        {/* 버튼 */}
        <div
          css={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <Button type="submit">확인</Button>
          <Button type="reset" color="secondary" onClick={handleClickCancel}>
            취소
          </Button>
        </div>
      </ModalForm>,
      document.body,
      'create',
    )
  );
};

export default CreateRoomModal;
