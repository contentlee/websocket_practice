import { palette } from "@utils/palette";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  msg: string;
}

const FromMsg = ({ msg, ...props }: Props) => {
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "10px",
        width: "100%",
        height: "42px",
        padding: "5px 10px",
        border: `1.5px solid ${palette.gray.gray83}`,
        boxSizing: "border-box",
        background: palette.background,
        fontSize: "14px",
        color: palette.main.blk,
      }}
      {...props}
    >
      <div>{msg}</div>
    </div>
  );
};

export default FromMsg;
