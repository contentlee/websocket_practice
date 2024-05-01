import { useEffect } from 'react';

import { roomSocket } from '@socket';

import { palette } from '@utils/palette';

import { useAlert } from '@hooks';

import { Button, Circle, Input, TextArea, Title } from '@components';
import { CreateForm } from '.';

interface Props {
  closeModal: () => void;
}

const CreateRoomModal = ({ closeModal }: Props) => {
  const { addAlert } = useAlert();

  useEffect(() => {
    const duplicatedName = () => {
      addAlert('error', '중복된 채팅방이 존재합니다.');
    };
    roomSocket.duplicatedName(duplicatedName).on();

    const wrongMax = () => {
      addAlert('error', '최대값이 잘못 설정되었습니다.');
    };
    roomSocket.wrongMax(wrongMax).on();

    return () => {
      roomSocket.duplicatedName(duplicatedName).off();
      roomSocket.wrongMax(wrongMax).off();
    };
  }, [addAlert, roomSocket]);

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
