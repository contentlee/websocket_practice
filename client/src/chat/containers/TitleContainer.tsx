import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router";
import { Socket } from "socket.io-client";

import { RoomTitle } from "../components";

const TitleContainer = () => {
  const { name } = useParams();

  const { socket } = useOutletContext<{ socket: Socket }>();
  const [length, setLength] = useState(0);

  useEffect(() => {
    socket.emit("count_member", name, (roomSize: number) => {
      setLength(roomSize);
    });
  }, [name, socket]);
  return <RoomTitle name={name} length={length}></RoomTitle>;
};

export default TitleContainer;
