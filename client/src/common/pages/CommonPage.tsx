import { Outlet } from "react-router";
import { io } from "socket.io-client";
import { Overlay } from "../components";
import { AlarmContainer, AlertContainer } from "../containers";

const CommonPage = () => {
  const socket = io("ws://localhost:8080");

  return (
    <div
      css={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Overlay />
      <AlertContainer />
      <AlarmContainer socket={socket} />
      <Outlet context={{ socket }}></Outlet>
    </div>
  );
};

export default CommonPage;
