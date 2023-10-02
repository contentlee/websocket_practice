import { palette } from "@utils/palette";
import { HTMLAttributes } from "react";
interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string;
  msg?: string;
}

const EnterMsg = ({ name, msg = "", ...props }: Props) => {
  return (
    <div
      css={{
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",
      }}
      {...props}
    >
      <hr
        css={{
          display: "flex",
          flex: "auto",
          height: "0.5px",
          background: palette.gray.gray52,
          border: "none",
        }}
      />
      <div
        css={{
          color: palette.gray.gray52,
          fontSize: "14px",
        }}
      >
        {name} {msg}
      </div>
      <hr
        css={{
          display: "flex",
          flex: "auto",
          height: "0.5px",
          background: palette.gray.gray52,
          border: "none",
        }}
      />
    </div>
  );
};

export default EnterMsg;
