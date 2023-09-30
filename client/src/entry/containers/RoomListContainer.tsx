import { useState } from "react";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Socket } from "socket.io-client";

import AddIcon from "@assets/add_circle_icon.svg";

import { modalAtom } from "@atoms/stateAtom";

import { palette } from "@utils/palette";

import { RoomItem } from "../components";
import { Icon } from "@components";

import { EmptyListContainer } from ".";

const RoomListContainer = () => {
  const navigate = useNavigate();
  const { socket } = useOutletContext<{ socket: Socket }>();

  const [_, setModal] = useRecoilState(modalAtom);

  const handleClickRoom = (e: React.MouseEvent, name: string) => {
    e.preventDefault();
    navigate(`/chat/${name}`);
  };

  const handleClickCreate = (e: React.MouseEvent) => {
    e.preventDefault();
    setModal({ isOpened: true, type: "create" });
  };

  const [rooms, setRooms] = useState([]);

  socket?.on("change_rooms", (list) => {
    setRooms(list);
  });
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "10px",
      }}
    >
      {rooms.length === 0 ? (
        <EmptyListContainer></EmptyListContainer>
      ) : (
        rooms.map(({ name, length }, i) => {
          if (i === rooms.length - 1)
            return (
              <>
                <RoomItem name={name} value={length} onClick={(e) => handleClickRoom(e, name)}></RoomItem>
                <div
                  css={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                  onClick={handleClickCreate}
                >
                  <hr
                    css={{
                      display: "flex",
                      flex: "auto",
                      height: "0.5px",
                      background: palette.gray.gray83,
                      border: "none",
                    }}
                  />
                  <Icon src={AddIcon}></Icon>
                  <hr
                    css={{
                      display: "flex",
                      flex: "auto",
                      height: "0.5px",
                      background: palette.gray.gray83,
                      border: "none",
                    }}
                  />
                </div>
              </>
            );
          return <RoomItem name={name} value={length} onClick={(e) => handleClickRoom(e, name)}></RoomItem>;
        })
      )}
    </div>
  );
};

export default RoomListContainer;
