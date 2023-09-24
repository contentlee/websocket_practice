import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const Input = ({ ...props }: Props) => {
  return (
    <input
      {...props}
      css={{
        width: "100%",
        height: "32px",
        padding: "0 8px",
        border: "1px solid #DEDEDE",
        outline: "none",
        boxSizing: "border-box",
        fontSize: "12px",
      }}
    ></input>
  );
};
export default Input;
