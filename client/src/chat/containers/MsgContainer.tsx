import { useOutletContext } from "react-router-dom";

import { useEffect, useState } from "react";
import { EnterMsg, FromMsg, ToMsg } from "../components";
import { Socket } from "socket.io-client/debug";

interface Message {
  type: "welcome" | "from" | "to";
  message: string;
  name: string;
}

const MsgContainer = () => {
  const { socket } = useOutletContext<{ socket: Socket }>();

  const [msg, setMsg] = useState<Message[]>([]);

  socket?.on("welcome", (name) => {
    setMsg([...msg, { type: "welcome", name, message: "이(가) 참여하셨습니다." }]);
  });

  socket?.on("new_message", (name, message) => {
    setMsg([...msg, { type: "to", name, message }]);
  });

  useEffect(() => {}, []);
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <EnterMsg name="익명"></EnterMsg>
      <FromMsg msg="안녕"></FromMsg>
      <ToMsg name="익명" msg="안녕하세요"></ToMsg>
    </div>
  );
};

export default MsgContainer;
