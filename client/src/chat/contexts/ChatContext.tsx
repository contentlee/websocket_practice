import { createContext, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { useRecoilValue } from "recoil";

import { userAtom } from "@atoms/userAtom";
import { Socket } from "socket.io-client";

export const TitleContext = createContext({
  name: "익명",
  length: 0,
});

export interface Msg {
  type: string;
  date: Date;
  msg: string;
  user: string;
}

interface Room {
  name: string;
  attendee: string[];
  chat: Msg[];
}

export const MsgContext = createContext<Msg[]>([]);

export const HandlerContext = createContext({
  handleAddMsg: (msg: Msg) => {},
});

const ChatContext = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const { name } = useParams();

  const { socket } = useOutletContext<{ socket: Socket }>();
  const userInfo = useRecoilValue(userAtom);

  const [title, setTitle] = useState({ name: "익명", length: 0 });
  const [msgs, setMsgs] = useState<Msg[]>([]);

  const handleAddMsg = (msg: Msg) => setMsgs([...msgs, msg]);

  useEffect(() => {
    if (!userInfo.name) navigate("/login");

    if (socket && name) {
      socket.emit("get_room", name, userInfo.name, (room: Room) => {
        setTitle({ name, length: room.attendee.length });
        const chat = room.chat.map((room) => {
          if (room.type === "message") {
            room.type = room.user === userInfo.name ? "from" : "to";
          }
          return room;
        });
        setMsgs(chat);
      });
    }
  }, [socket, userInfo, name, navigate]);

  return (
    <TitleContext.Provider value={title}>
      <MsgContext.Provider value={msgs}>
        <HandlerContext.Provider value={{ handleAddMsg }}>{children}</HandlerContext.Provider>
      </MsgContext.Provider>
    </TitleContext.Provider>
  );
};

export default ChatContext;
