import { Outlet } from "react-router";
import { io } from "socket.io-client";

const CommonPage = () => {
  const socket = io("ws://localhost:8080");

  return (
    <div
      css={{
        width: "100%",
      }}
    >
      <Outlet context={{ socket }}></Outlet>
    </div>
  );
};

export default CommonPage;
