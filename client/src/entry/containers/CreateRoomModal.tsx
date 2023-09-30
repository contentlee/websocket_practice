import { useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";
import { useRecoilState } from "recoil";
import { produce } from "immer";
import { Socket } from "socket.io-client";

import { modalAtom } from "@atoms/stateAtom";

import { palette } from "@utils/palette";

import { Button, Input, TextArea } from "@components";
import { Title } from "../components";

const CreateRoomModal = () => {
  const navigate = useNavigate();

  const { socket } = useOutletContext<{ socket: Socket }>();
  const [_, setModal] = useRecoilState(modalAtom);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [name, length, notification] = [e.currentTarget[0].value, e.currentTarget[1].value, e.currentTarget[2].value];

    if (!name) return;
    socket?.emit("create_room", name, () => {
      navigate(`/chat/${name}`);
    });
  };

  const handleClickCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    setModal((prev) =>
      produce(prev, (draft) => {
        draft.isOpened = false;
        return draft;
      })
    );
  };
  return (
    <form
      css={{
        position: "relative",
        top: "10px",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: "310px",
        maxWidth: "390px",
        padding: "20px",
        gap: "16px",
        border: "1.5px solid" + palette.main.blk,
        background: palette.background,
        boxSizing: "border-box",
      }}
      onSubmit={handleSubmit}
    >
      <Title type="create">채팅방 생성하기</Title>

      <Input label="이름" css={{ width: "100%" }}></Input>
      <Input type="number" label="최대인원" css={{ width: "100%" }}></Input>
      <TextArea label="첫공지" css={{ width: "100%" }}></TextArea>
      <div
        css={{
          display: "flex",
          gap: "10px",
        }}
      >
        <Button type="submit">확인</Button>
        <Button type="reset" color="secondary" onClick={handleClickCancel}>
          취소
        </Button>
      </div>
    </form>
  );
};

export default CreateRoomModal;
