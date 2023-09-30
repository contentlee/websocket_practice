import { Regtangle } from "@components";
import { HTMLAttributes } from "react";
interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string;
  length: number;
}

const RoomTitle = ({ name, length, ...props }: Props) => {
  return (
    <div
      {...props}
      css={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <Regtangle></Regtangle>
      {name}({length})
    </div>
  );
};
export default RoomTitle;
