import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Socket } from "socket.io-client/debug";

import { EnterMsg, FromMsg, ToMsg } from "../components";
import { alertAtom } from "@atoms/stateAtom";

interface Message {
  type: "welcome" | "bye" | "from" | "to";
  message: string;
  name: string;
}

const MsgContainer = () => {
  const navigate = useNavigate();
  const { socket } = useOutletContext<{ socket: Socket }>();

  const [_, setAlert] = useRecoilState(alertAtom);
  const [msg, setMsg] = useState<Message[]>([]);

  socket.on("need_login", () => {
    navigate("/login");
    setAlert({ isOpened: true, type: "error", children: "로그인이 필요합니다." });
  });

  socket.on("welcome", (name) => {
    setMsg([...msg, { type: "welcome", name, message: "님이 참여하셨습니다." }]);
  });

  socket.on("my_message", (message) => {
    setMsg([...msg, { type: "from", name: "me", message }]);
  });

  socket?.on("new_message", (name, message) => {
    setMsg([...msg, { type: "to", name, message }]);
  });

  socket.on("bye", (name) => {
    setMsg([...msg, { type: "bye", name, message: "님이 퇴장하셨습니다." }]);
  });

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {msg.map(({ type, message, name }, i) => {
        if (type === "from") return <FromMsg msg={message} key={i} />;
        if (type === "welcome") return <EnterMsg name={name} msg={message} key={i} />;
        if (type === "bye") return <EnterMsg name={name} msg={message} key={i} />;
        return <ToMsg name={name} msg={message} key={i} />;
      })}
    </div>
  );
};

export default MsgContainer;
