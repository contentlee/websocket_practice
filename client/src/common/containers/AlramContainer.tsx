import { useState } from "react";
import { useNavigate } from "react-router";
import { createPortal } from "react-dom";
import { useRecoilState } from "recoil";
import { Socket } from "socket.io-client";
import { keyframes } from "@emotion/react";

import { palette } from "@utils/palette";
import { alarmAtom } from "@atoms/stateAtom";

import Icon from "../components/Icon";

import CallIcon from "@assets/call_icon_wht.svg";
import VedioCallIcon from "@assets/video_call_icon_wht.svg";
import CallRejectIcon from "@assets/call_reject_icon.svg";
import CancelIcon from "@assets/close_icon.svg";
import { produce } from "immer";

interface Props {
  socket: Socket;
}

const animate = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
`;

const AlarmContainer = ({ socket }: Props) => {
  const navigate = useNavigate();
  const [alarm, setAlarm] = useRecoilState(alarmAtom);
  const [name, setName] = useState("");

  const handleClickCallPermit = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit("permit_call", name);
    navigate("/call" + name);
  };
  const handleClickCallCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit("cancel_call");
    setAlarm((prev) =>
      produce(prev, (draft) => {
        draft.isOpened = false;
        return draft;
      })
    );
  };

  const handleClickVideoCallPermit = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit("permit_video_call");
    navigate("/video" + name);
  };

  const handleClickVideoCallCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit("cancel_video_call");
    setAlarm((prev) =>
      produce(prev, (draft) => {
        draft.isOpened = false;
        return draft;
      })
    );
  };

  socket.on("require_call", (userName) => {
    setAlarm({ isOpened: true, type: "call" });
    setName(userName);
  });

  socket.on("require_video_call", (userName) => {
    setAlarm({ isOpened: true, type: "video" });
    setName(userName);
  });

  return (
    alarm.isOpened &&
    createPortal(
      <div
        css={{
          position: "absolute",
          bottom: 0,
        }}
      >
        <div
          css={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "390px",
            minWidth: "310px",
            boxSizing: "border-box",
          }}
        >
          <div
            css={{
              position: "absolute",
              left: 0,
              bottom: "16px",
              padding: "16px",
              borderRadius: 50,
              background: palette.point.green,
              boxShadow: "2px 2px 10px 1px rgba(0,0,0,.2)",
              animation: animate + ".5s ease-in forwards",
              overflow: "hidden",
            }}
          >
            <Icon
              src={alarm.type === "call" ? CallIcon : VedioCallIcon}
              onClick={alarm.type === "call" ? handleClickCallPermit : handleClickVideoCallPermit}
            ></Icon>
          </div>
          <div
            css={{
              position: "absolute",
              right: 0,
              bottom: "16px",
              padding: "16px",
              borderRadius: 50,
              background: palette.point.red,
              boxShadow: "2px 2px 10px 1px rgba(0,0,0,.2)",
              animation: animate + ".5s ease-in forwards",
              overflow: "hidden",
            }}
          >
            <Icon
              src={alarm.type === "call" ? CallRejectIcon : CancelIcon}
              onClick={alarm.type === "call" ? handleClickCallCancel : handleClickVideoCallCancel}
            ></Icon>
          </div>
        </div>
      </div>,
      document.body,
      "alarm"
    )
  );
};

export default AlarmContainer;
