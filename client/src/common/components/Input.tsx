import { palette } from "@utils/palette";
import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = ({ label, ...props }: Props) => {
  return (
    <div
      css={{
        position: "relative",
        display: "flex",
        boxSizing: "border-box",
        color: palette.main.blk,
      }}
    >
      <input
        type="text"
        css={{
          height: "42px",
          border: `1.5px solid ${palette.main.blk}`,
          boxSizing: "border-box",
          background: palette.background,
          fontSize: "14px",
        }}
        {...props}
      ></input>
      <label
        css={{
          left: "10px",
          top: "-7px",
          padding: "0 4px",
          fontSize: "12px",
          whiteSpace: "nowrap",
          background: palette.background,
        }}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
