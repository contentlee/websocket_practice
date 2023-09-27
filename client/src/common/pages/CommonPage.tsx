import { useEffect } from "react";
import { Outlet } from "react-router";
import { io } from "socket.io-client";
import { useRecoilState } from "recoil";

import { socketAtom } from "@atoms/socketAtom";

const CommonPage = () => {
  const [_, setSocket] = useRecoilState(socketAtom);

  useEffect(() => {
    const socket = io("ws://localhost:8080");
    setSocket(socket);
  }, []);
  return (
    <div>
      <Outlet></Outlet>
    </div>
  );
};

export default CommonPage;
