import { Button, Input } from "@components";
import { Title } from "../components";

const CreateRoomModal = () => {
  return (
    <form
      css={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        gap: "10px",
      }}
    >
      <Title type="create">채팅방 생성하기</Title>
      <Input label="이름"></Input>
      <Input label="최대인원"></Input>
      <Input label="첫공지"></Input>
      <div
        css={{
          display: "flex",
          gap: "10px",
        }}
      >
        <Button type="submit">확인</Button>
        <Button type="reset" color="secondary">
          취소
        </Button>
      </div>
    </form>
  );
};

export default CreateRoomModal;
