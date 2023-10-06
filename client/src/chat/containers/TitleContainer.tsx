import { useContext } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil";
import { Socket } from "socket.io-client";

import { RoomTitle } from "../components";
import { TitleContext } from "../contexts/ChatContext";

import { Icon } from "@components";

import { userAtom } from "@atoms/userAtom";
import { modalAtom } from "@atoms/stateAtom";

import { palette } from "@utils/palette";

import ExitIcon from "@assets/exit_icon.svg";

const TitleContainer = () => {
  const navigate = useNavigate();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const title = useContext(TitleContext);

  const userInfo = useRecoilValue(userAtom);
  const [_, setModal] = useRecoilState(modalAtom);

  const handleClickLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit("leave_room", title.name, userInfo.name, () => {
      navigate("/");
    });
  };

  const handleClickTitle = (e: React.MouseEvent) => {
    e.preventDefault();
    setModal({ isOpened: true, type: "attendeeList" });
  };

  return (
    <div
      css={{
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        top: 0,
        left: 0,
        boxSizing: "border-box",
        background: palette.background,
      }}
    >
      <div
        css={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "390px",
          minWidth: "310px",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <RoomTitle name={title.name} length={title.length} onClick={handleClickTitle}></RoomTitle>
        <Icon src={ExitIcon} size="small" onClick={handleClickLeave}></Icon>
      </div>
    </div>
  );
};

export default TitleContainer;
