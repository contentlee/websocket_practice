import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Socket } from "socket.io-client";

import { alertAtom, modalAtom } from "@atoms/stateAtom";

import { AddItem, RoomItem } from "../components";

import { EmptyListContainer } from ".";

interface Room {
  name: string;
  length: number;
  possible: boolean;
}

const RoomListContainer = () => {
  const navigate = useNavigate();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const [_, setModal] = useRecoilState(modalAtom);
  const [__, setAlert] = useRecoilState(alertAtom);

  const [rooms, setRooms] = useState<Room[]>([]);

  const handleClickRoom = (e: React.MouseEvent, name: string) => {
    e.preventDefault();
    socket.emit("enter_room", name, () => {
      navigate(`/chat/${name}`);
    });
  };

  const handleClickCreate = (e: React.MouseEvent) => {
    e.preventDefault();
    setModal({ isOpened: true, type: "create" });
  };

  socket.on("change_rooms", (list) => {
    setRooms(list);
  });
  socket.on("need_login", () => {
    navigate("/login");
    setAlert({ isOpened: true, type: "error", children: "로그인이 필요합니다." });
  });

  useEffect(() => {
    socket.emit("show_room", (roomList: Room[]) => {
      setRooms(roomList);
    });
  }, [socket]);

  if (rooms.length === 0)
    return (
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "10px",
        }}
      >
        <EmptyListContainer></EmptyListContainer>
      </div>
    );

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "10px",
      }}
    >
      {rooms.map(({ name, length, possible }) => {
        return (
          <RoomItem
            key={name}
            name={name}
            value={length}
            possible={possible}
            onClick={possible ? (e) => handleClickRoom(e, name) : () => {}}
          />
        );
      })}
      <AddItem onClick={handleClickCreate} />
    </div>
  );
};

export default RoomListContainer;
