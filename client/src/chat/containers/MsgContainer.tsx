import { useContext, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Socket } from "socket.io-client/debug";

import { alertAtom } from "@atoms/stateAtom";

import { EnterMsg, FromMsg, ToMsg } from "../components";

import { HandlerContext, MsgContext } from "../contexts/ChatContext";

const MsgContainer = () => {
  const navigate = useNavigate();
  const { socket } = useOutletContext<{ socket: Socket }>();

  const wrapRef = useRef<HTMLDivElement>(null);

  const msgs = useContext(MsgContext);
  const { handleAddMsg } = useContext(HandlerContext);
  const [_, setAlert] = useRecoilState(alertAtom);

  socket.on("need_login", () => {
    navigate("/login");
    setAlert({ isOpened: true, type: "error", children: "로그인이 필요합니다." });
  });

  socket.on("welcome", (user) => {
    handleAddMsg({ type: "welcome", user, msg: `${user} 님이 참여하셨습니다.`, date: new Date() });
  });

  socket?.on("new_message", (user, msg) => {
    handleAddMsg({ type: "to", user, msg, date: new Date() });
  });

  socket.on("bye", (user) => {
    handleAddMsg({ type: "bye", user, msg: `${user} 님이 퇴장하셨습니다.`, date: new Date() });
  });

  useEffect(() => {
    if (wrapRef.current) {
      // const clientHeight = wrapRef.current.clientHeight;
      // const curScroll = wrapRef.current.scrollTop;
      const scrollHeight = wrapRef.current.scrollHeight;
      // if (clientHeight + curScroll > scrollHeight - 200)
      wrapRef.current.scrollTop = scrollHeight;
    }
  }, [msgs]);

  return (
    <div
      ref={wrapRef}
      css={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "64px 20px 52px",
        overflow: "auto",
      }}
    >
      {msgs.map(({ type, msg, user }, i) => {
        if (type === "from") return <FromMsg msg={msg} key={i} />;
        if (type === "welcome") return <EnterMsg name={user} msg={msg} key={i} />;
        if (type === "bye") return <EnterMsg name={user} msg={msg} key={i} />;
        return <ToMsg name={user} msg={msg} key={i} />;
      })}
    </div>
  );
};

export default MsgContainer;
