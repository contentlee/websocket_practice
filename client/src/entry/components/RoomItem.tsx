import { HTMLAttributes } from "react";
import { palette } from "@utils/palette";

interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string;
  value: number | string;
}

const RoomItem = ({ name, value }: Props) => {
  return (
    <div
      css={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "42px",
        padding: "5px 20px",
        border: `1.5px solid ${palette.main.blk}`,
        boxSizing: "border-box",
        background: palette.background,
        fontSize: "14px",
        color: palette.main.blk,
        cursor: "pointer",
        "&:hover": {
          filter: "scale(120%)",
        },
      }}
    >
      <div css={{ fontWeight: 600 }}>{name}</div>
      <div>({value})</div>
    </div>
  );
};

export default RoomItem;
