import { palette } from "@utils/palette";

interface Props {
  type?: "list" | "create";
  children?: React.ReactNode;
}

const Title = ({ type = "list", children }: Props) => {
  return (
    <div
      css={{
        display: "flex",
        gap: "10px",
        fontSize: "14px",
        color: palette.gray.gray52,
      }}
    >
      <div>{children}</div>
      <div
        css={{
          width: "14px",
          height: "14px",
          borderRadius: "50px",
          ...TYPE_VARIANT[type],
        }}
      ></div>
    </div>
  );
};

const TYPE_VARIANT = {
  list: {
    background: palette.point.green,
  },
  create: {
    background: palette.point.blue,
  },
};

export default Title;
