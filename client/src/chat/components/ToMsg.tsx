import { palette } from "@utils/palette";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string;
  msg: string;
}

const ToMsg = ({ name, msg, ...props }: Props) => {
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "100%",
        minHeight: "42px",
        padding: "5px 10px",
        border: `1.5px solid ${palette.main.blk}`,
        boxSizing: "border-box",
        background: palette.background,
        fontSize: "14px",
        color: palette.main.blk,
      }}
      {...props}
    >
      <div
        css={{
          fontWeight: 700,
        }}
      >
        {name}
      </div>
      <div>{msg}</div>
    </div>
  );
};

export default ToMsg;
