import { useContext, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Socket } from "socket.io-client/debug";

import { alertAtom } from "@atoms/stateAtom";

import { EnterMsg, FromMsg, ToMsg } from "../components";

import { HandlerContext, MsgContext } from "../contexts/ChatContext";
import { useAnimate } from "@hooks";

const MsgContainer = () => {
  const navigate = useNavigate();

  const [animation, setAnimation] = useAnimate();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const wrapRef = useRef<HTMLDivElement>(null);

  const msgs = useContext(MsgContext);
  const { handleAddMsg } = useContext(HandlerContext);
  const [_, setAlert] = useRecoilState(alertAtom);

  useEffect(() => {
    const needLogin = () => {
      setAlert({ isOpened: true, type: "error", children: "로그인이 필요합니다." });
      setAnimation({
        type: "fadeOut",
        callback: () => {
          navigate("/login");
        },
      });
    };

    const welcome = (user: string) => {
      handleAddMsg({ type: "welcome", user, msg: `${user} 님이 참여하셨습니다.`, date: new Date() });
    };

    const newMessage = (user: string, msg: string) => {
      handleAddMsg({ type: "to", user, msg, date: new Date() });
    };

    const bye = (user: string) => {
      handleAddMsg({ type: "bye", user, msg: `${user} 님이 퇴장하셨습니다.`, date: new Date() });
    };

    socket.on("need_login", needLogin);
    socket.on("welcome", welcome);
    socket.on("new_message", newMessage);
    socket.on("bye", bye);

    return () => {
      socket.off("need_login", needLogin);
      socket.off("welcome", welcome);
      socket.off("new_message", newMessage);
      socket.off("bye", bye);
    };
  }, [handleAddMsg, navigate, setAlert, setAnimation, socket]);

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
        animation: animation ? animation + ".2s forwards ease-out" : "",
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
