import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createPortal } from "react-dom";
import { useRecoilState } from "recoil";
import { Socket } from "socket.io-client";

import { palette } from "@utils/palette";
import { alarmAtom } from "@atoms/stateAtom";

import Icon from "../components/Icon";

import CallIcon from "@assets/call_icon_wht.svg";
import VedioCallIcon from "@assets/video_call_icon_wht.svg";
import CallRejectIcon from "@assets/call_reject_icon.svg";
import CancelIcon from "@assets/close_icon.svg";
import { produce } from "immer";
import { useAnimate } from "@hooks";

interface Props {
  socket: Socket;
}

const AlarmContainer = ({ socket }: Props) => {
  const navigate = useNavigate();

  const [animation, setAnimation] = useAnimate();

  const [alarm, setAlarm] = useRecoilState(alarmAtom);
  const [name, setName] = useState("");

  const handleClickCallPermit = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit("permit_call", name, () => {
      setAnimation({
        type: "closeAlarm",
        time: 600,
        callback: () => {
          setAlarm((prev) =>
            produce(prev, (draft) => {
              draft.isOpened = false;
              return draft;
            })
          );
          navigate("/call/" + name);
        },
      });
    });
  };
  const handleClickCallCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit("cancel_call", name, () => {
      setAnimation({
        type: "closeAlarm",
        time: 600,
        callback: () => {
          setAlarm((prev) =>
            produce(prev, (draft) => {
              draft.isOpened = false;
              return draft;
            })
          );
        },
      });
    });
  };

  const handleClickVideoCallPermit = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit("permit_video_call", () => {
      setAnimation({
        type: "closeAlarm",
        time: 600,
        callback: () => {
          setAlarm((prev) =>
            produce(prev, (draft) => {
              draft.isOpened = false;
              return draft;
            })
          );
          navigate("/video/" + name);
        },
      });
    });
  };

  const handleClickVideoCallCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit("cancel_video_call", name, () => {
      setAnimation({
        type: "closeAlarm",
        time: 600,
        callback: () => {
          setAlarm((prev) =>
            produce(prev, (draft) => {
              draft.isOpened = false;
              return draft;
            })
          );
        },
      });
    });
  };

  useEffect(() => {
    setAnimation({ type: "showAlarm", time: 600, callback: () => {} });
  }, [setAnimation]);

  useEffect(() => {
    const requireCall = (userName: string) => {
      setAlarm({ isOpened: true, type: "call" });
      setName(userName);
    };

    const requireVideoCall = (userName: string) => {
      setAlarm({ isOpened: true, type: "video" });
      setName(userName);
    };

    socket.on("require_call", requireCall);
    socket.on("require_video_call", requireVideoCall);
  }, [setAlarm, socket]);

  return (
    alarm.isOpened &&
    createPortal(
      <div
        css={{
          zIndex: 1500,
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
              animation: animation + ".5s ease-in forwards",
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
              animation: animation + ".5s ease-in forwards",
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
