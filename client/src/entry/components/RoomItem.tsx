import { HTMLAttributes } from "react";
import { palette } from "@utils/palette";

interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string;
  value: number | string;
  possible: boolean;
}

const RoomItem = ({ name, value, possible, ...props }: Props) => {
  return (
    <div
      css={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "42px",
        padding: "5px 20px",
        border: `1.5px solid ${possible ? palette.main.blk : palette.point.red}`,
        boxSizing: "border-box",
        background: palette.background,
        fontSize: "14px",
        color: palette.main.blk,
        cursor: possible ? "pointer" : "none",
        "&:hover": {
          filter: possible ? "scale(120%)" : "scale(100%)",
        },
      }}
      {...props}
    >
      <div css={{ fontWeight: 600 }}>{name}</div>
      <div>({value})</div>
    </div>
  );
};

export default RoomItem;
