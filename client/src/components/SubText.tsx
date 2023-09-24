import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const SubText = ({ children, ...props }: Props) => {
  return (
    <div
      {...props}
      css={{
        fontSize: "12px",
      }}
    >
      {children}
    </div>
  );
};

export default SubText;
