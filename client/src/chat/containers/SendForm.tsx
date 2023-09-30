import { HTMLAttributes } from "react";
import { Button } from "@components";
import { InputMsg } from "../components";

interface Props extends HTMLAttributes<HTMLFormElement> {}

const SendForm = ({ ...props }: Props) => {
  return (
    <form css={{ display: "flex", alignItems: "flex-end", gap: "5px", width: "100%" }} {...props}>
      <InputMsg></InputMsg>
      <Button>보내기</Button>
    </form>
  );
};

export default SendForm;
