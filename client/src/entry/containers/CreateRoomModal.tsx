import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { useOutletContext } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';

import { alertAtom, closeModalAction, modalAtom } from '@atoms/stateAtom';
import { userAtom } from '@atoms/userAtom';
import { palette } from '@utils/palette';
import { useAnimate } from '@hooks';
import { Button, Input, TextArea } from '@components';

import { Title } from '../components';

const CreateRoomModal = () => {
  const navigate = useNavigate();

  const [animation, setAnimation] = useAnimate();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const userInfo = useRecoilValue(userAtom);
  const [{ isOpened }, setModal] = useRecoilState(modalAtom);
  const [_, setAlert] = useRecoilState(alertAtom);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [roomName, maxLength, notification] = [
      (e.currentTarget[0] as HTMLInputElement).value,
      (e.currentTarget[1] as HTMLInputElement).value,
      (e.currentTarget[2] as HTMLInputElement).value,
    ];

    if (!roomName) return;

    socket?.emit(
      'create_room',
      roomName,
      maxLength ? maxLength : 100,
      notification,
      userInfo.name,
      () => {
        setAnimation({
          type: 'fadeOut',
          callback: () => {
            navigate(`/chat/${roomName}`);
            setModal(closeModalAction);
          },
        });
      },
    );
  };

  const handleClickCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    setModal(closeModalAction);
  };

  useEffect(() => {
    const needLogin = () => {
      setAlert({
        isOpened: true,
        type: 'error',
        children: '로그인이 필요합니다.',
      });

      setAnimation({
        type: 'fadeOut',
        callback: () => {
          navigate('/login');
        },
      });
    };

    const duplicatedName = () => {
      setAlert({
        isOpened: true,
        type: 'error',
        children: '중복된 채팅방이 존재합니다.',
      });
    };

    socket.on('need_login', needLogin);
    socket.on('duplicated_name', duplicatedName);

    return () => {
      socket.off('need_login', needLogin);
      socket.off('duplicated_name', duplicatedName);
    };
  }, [navigate, setAlert, setAnimation, socket]);

  useEffect(() => {
    setAnimation({ type: 'fadeIn', callback: () => {} });
  }, [setAnimation]);
  return (
    isOpened &&
    createPortal(
      <form
        css={{
          zIndex: 1000,
          position: 'absolute',
          top: '20px',
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
          animation: animation ? animation + '.2s forwards ease-in-out' : '',
        }}
        onSubmit={handleSubmit}
      >
        <Title type="create">채팅방 생성하기</Title>

        <Input label="이름" css={{ width: '100%' }}></Input>
        <Input type="number" label="최대인원" css={{ width: '100%' }}></Input>
        <TextArea label="첫공지" css={{ width: '100%' }}></TextArea>
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
      </form>,
      document.body,
      'create',
    )
  );
};

export default CreateRoomModal;
