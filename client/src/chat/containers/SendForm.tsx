import { HTMLAttributes } from "react";
import { Button } from "@components";
import { InputMsg } from "../components";
import { useOutletContext, useParams } from "react-router";
import { Socket } from "socket.io-client";

interface Props extends HTMLAttributes<HTMLFormElement> {}

const SendForm = ({ ...props }: Props) => {
  const { socket } = useOutletContext<{ socket: Socket }>();

  const { name } = useParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget[0] as HTMLTextAreaElement;
    console.log(target.value);
    if (!target.value) return;
    socket.emit("new_message", target.value, name, () => {
      target.value = "";
    });
  };

  return (
    <div
      css={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        position: "fixed",
        bottom: 0,
        left: 0,
        boxSizing: "border-box",
      }}
    >
      <form
        css={{
          display: "flex",
          alignItems: "flex-end",
          gap: "5px",
          width: "100%",
          maxWidth: "390px",
          minWidth: "310px",
          boxSizing: "border-box",
        }}
        onSubmit={handleSubmit}
        {...props}
      >
        <InputMsg></InputMsg>
        <Button type="submit">보내기</Button>
      </form>
    </div>
  );
};

export default SendForm;
