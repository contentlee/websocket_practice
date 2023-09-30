import { palette } from "@utils/palette";
import { HTMLAttributes } from "react";
interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string;
}

const EnterMsg = ({ name, ...props }: Props) => {
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
        {name} 님이 참여하였습니다.
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
