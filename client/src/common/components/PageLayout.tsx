import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const PageLayout = ({ children, ...props }: Props) => {
  return (
    <div
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "390px",
        height: "100%",
        padding: "20px",
        boxSizing: "border-box",
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default PageLayout;
