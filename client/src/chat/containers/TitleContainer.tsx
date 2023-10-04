import { useContext } from "react";

import { RoomTitle } from "../components";
import { TitleContext } from "../contexts/ChatContext";

const TitleContainer = () => {
  const { name, length } = useContext(TitleContext);

  return <RoomTitle name={name} length={length}></RoomTitle>;
};

export default TitleContainer;
