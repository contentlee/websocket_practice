import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Socket } from "socket.io-client";

import { alertAtom, closeModalAction, modalAtom } from "@atoms/stateAtom";

import { palette } from "@utils/palette";

import { Button, Input, TextArea } from "@components";
import { Title } from "../components";

const CreateRoomModal = () => {
  const navigate = useNavigate();

  const { socket } = useOutletContext<{ socket: Socket }>();
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

    setModal(closeModalAction);

    socket?.emit("create_room", roomName, maxLength ? maxLength : 100, notification, () => {
      navigate(`/chat/${roomName}`);
    });
  };

  const handleClickCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    setModal(closeModalAction);
  };

  socket.on("need_login", () => {
    navigate("/login");
    setAlert({ isOpened: true, type: "error", children: "로그인이 필요합니다." });
  });

  socket.on("duplicated_name", () => {
    setAlert({ isOpened: true, type: "error", children: "중복된 채팅방이 존재합니다." });
  });

  return (
    isOpened &&
    createPortal(
      <form
        css={{
          zIndex: 1000,
          position: "absolute",
          top: "20px",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minWidth: "290px",
          maxWidth: "370px",
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
      </form>,
      document.body,
      "create"
    )
  );
};

export default CreateRoomModal;
