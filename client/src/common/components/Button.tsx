import { palette } from "@utils/palette";
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "primary" | "secondary";
  children?: React.ReactNode;
}

const Button = ({ color = "primary", children, ...props }: Props) => {
  return (
    <button
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "42px",
        padding: "0 24px",
        boxSizing: "border-box",
        transition: ".2s",
        cursor: "pointer",
        ...COLOR_VARIANTS[color],
      }}
      {...props}
    >
      {children}
    </button>
  );
};

const COLOR_VARIANTS = {
  primary: {
    color: palette.main.wht,
    backgroundColor: palette.main.blk,

    "&:hover": {
      backgroundColor: palette.point.blue,
    },
  },
  secondary: {
    border: "1px solid transparent",
    color: palette.main.blk,
    backgroundColor: palette.main.wht,
    borderColor: palette.main.blk,
    "&:hover": {
      color: palette.main.wht,
      backgroundColor: palette.point.red,
    },
  },
};

export default Button;
