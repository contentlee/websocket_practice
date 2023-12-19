import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useOutletContext } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { Socket } from 'socket.io-client';

import { userAtom } from '@atoms/userAtom';
import { modalAtom } from '@atoms/stateAtom';

import { useAlert } from '@hooks';
import { Button, Input, TextArea } from '@components';

import { ModalForm, Title } from '../components';
import { ModalContainer } from 'src/common/containers';

const CreateRoomModal = () => {
  const navigate = useNavigate();

  const [_, setAlert] = useAlert();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const { name } = useRecoilValue(userAtom);
  const resetModal = useResetRecoilState(modalAtom);

  const handleChangePage = (path: string) => {
    resetModal();
    navigate(path);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [roomName, maxLength, notification] = e.currentTarget.map(
      (element: HTMLInputElement) => element.value,
    );

    if (!roomName) return;

    const info = { roomName, maxLength: maxLength ? maxLength : 100, notification, name };
    const callback = () => handleChangePage(`/chat/${roomName}`);
    socket?.emit('create_room', info, callback);
  };

  const handleClickCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    resetModal();
  };

  useEffect(() => {
    const duplicatedName = () => {
      setAlert('error', '중복된 채팅방이 존재합니다.');
    };
    socket.on('duplicated_name', duplicatedName);

    return () => {
      socket.off('duplicated_name', duplicatedName);
    };
  }, [navigate, setAlert, socket]);

  return (
    <ModalContainer name="create">
      <ModalForm onSubmit={handleSubmit}>
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
      </ModalForm>
    </ModalContainer>
  );
};

export default CreateRoomModal;
