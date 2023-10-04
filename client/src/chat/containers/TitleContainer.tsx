import { useContext } from "react";

import { RoomTitle } from "../components";
import { TitleContext } from "../contexts/ChatContext";

const TitleContainer = () => {
  const { name, length } = useContext(TitleContext);

  return (
    <div
      css={{
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        top: 0,
        left: 0,
        boxSizing: "border-box",
      }}
    >
      <RoomTitle name={name} length={length}></RoomTitle>
    </div>
  );
};

export default TitleContainer;
