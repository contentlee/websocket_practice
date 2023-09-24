import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const Button = ({ children, ...props }: Props) => {
  return (
    <button
      {...props}
      css={{
        height: "32px",
        padding: "0 16px",
        background: "#0063C1",
        color: "#fff",
        fontSize: "12px",
        border: "none",
        borderRadius: 0,
        boxSizing: "border-box",
        whiteSpace: "nowrap",
        cursor: "pointer",
        "&:hover": {
          filter: "grayscale(20%)",
        },
      }}
    >
      {children}
    </button>
  );
};

export default Button;
