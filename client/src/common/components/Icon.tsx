import { ImgHTMLAttributes } from "react";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  size?: "small" | "medium" | "large" | "logo_a" | "logo_b" | "logo_c" | "add";
}

const Icon = ({ src, size = "medium", ...props }: Props) => {
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        cursor: "pointer",
        userSelect: "none",

        transition: "0.2s",

        ...SIZE_VARIANTS[size],

        "&:hover": {
          filter: "contrast(80%)",
        },
      }}
    >
      <img
        css={{
          width: "100%",
        }}
        src={src}
        {...props}
      />
    </div>
  );
};

const SIZE_VARIANTS = {
  small: {
    width: "18px",
  },
  medium: {
    width: "24px",
  },
  large: {
    width: "36px",
  },
  add: {
    width: "64px",
  },
  logo_a: {
    width: "100%",
    maxWidth: "290px",
  },
  logo_b: {
    width: "160px",
  },
  logo_c: {
    width: "80px",
  },
};
export default Icon;
