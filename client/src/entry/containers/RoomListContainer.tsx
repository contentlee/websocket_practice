import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Socket } from "socket.io-client";

import { alertAtom, modalAtom } from "@atoms/stateAtom";

import { AddItem, RoomItem } from "../components";

import { EmptyListContainer } from ".";
import { userAtom } from "@atoms/userAtom";
import { produce } from "immer";

interface Room {
  name: string;
  attendee: string[];
  max_length: number;
}

const RoomListContainer = () => {
  const navigate = useNavigate();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  const [_, setModal] = useRecoilState(modalAtom);
  const [__, setAlert] = useRecoilState(alertAtom);

  const [rooms, setRooms] = useState<Room[]>([]);

  const handleClickRoom = (e: React.MouseEvent, name: string) => {
    e.preventDefault();
    if (userInfo.name === "") return navigate("/login");
    socket.emit("enter_room", name, userInfo.name, () => {
      navigate(`/chat/${name}`);
    });
  };

  const handleClickCreate = (e: React.MouseEvent) => {
    e.preventDefault();
    if (userInfo.name === "") return navigate("/login");
    setModal({ isOpened: true, type: "create" });
  };

  useEffect(() => {
    socket.emit("get_rooms", userInfo.name, (roomList: Room[]) => {
      setRooms(roomList);
    });

    const changeRoom = (list: Room[]) => {
      setRooms(list);
    };
    const needLogin = () => {
      navigate("/login");
      setAlert({ isOpened: true, type: "error", children: "로그인이 필요합니다." });
    };

    socket.on("change_rooms", changeRoom);
    socket.on("need_login", needLogin);

    return () => {
      socket.off("change_rooms", changeRoom);
      socket.off("need_login", needLogin);
    };
  }, []);

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
      {rooms.map(({ name, attendee, max_length }) => {
        return (
          <RoomItem
            key={name}
            name={name}
            value={attendee.length}
            possible={attendee.length < max_length}
            onClick={attendee.length < max_length ? (e) => handleClickRoom(e, name) : () => {}}
          />
        );
      })}
      <AddItem onClick={handleClickCreate} />
    </div>
  );
};

export default RoomListContainer;
