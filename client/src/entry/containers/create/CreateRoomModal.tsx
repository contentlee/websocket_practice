import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import { palette } from '@utils/palette';

import { useAlert } from '@hooks';

import { Button, Circle, Input, TextArea, Title } from '@components';
import { CreateForm } from '.';

interface Props {
  closeModal: () => void;
}

const CreateRoomModal = ({ closeModal }: Props) => {
  const { addAlert } = useAlert();

  const { socket } = useOutletContext<{ socket: Socket }>();

  useEffect(() => {
    const duplicatedName = () => {
      addAlert('error', '중복된 채팅방이 존재합니다.');
    };
    socket.on('duplicated_name', duplicatedName);

    const wrong_max = () => {
      addAlert('error', '최대값이 잘못 설정되었습니다.');
    };
    socket.on('wrong_max', wrong_max);

    return () => {
      socket.off('duplicated_name', duplicatedName);
      socket.off('wrong_max', wrong_max);
    };
  }, [addAlert, socket]);

  return (
    <CreateForm closeModal={closeModal}>
      <Title>
        <div>채팅방 생성하기</div>
        <Circle css={{ background: palette.point.green }} />
      </Title>

      <Input label="이름" css={{ width: '100%' }} />
      <Input type="number" label="최대인원" css={{ width: '100%' }} min={0} />
      <TextArea label="첫공지" css={{ width: '100%' }} />

      <div
        css={{
          display: 'flex',
          gap: '10px',
        }}
      >
        <Button type="submit">확인</Button>
        <Button type="reset" color="secondary">
          취소
        </Button>
      </div>
    </CreateForm>
  );
};

export default CreateRoomModal;
