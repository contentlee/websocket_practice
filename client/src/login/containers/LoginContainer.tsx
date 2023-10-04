import { useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";
import { useRecoilState } from "recoil";
import { produce } from "immer";
import { Socket } from "socket.io-client";

import { Input, Button } from "@components";

import { userAtom } from "@atoms/userAtom";

const LoginContainer = () => {
  const navigate = useNavigate();

  const { socket } = useOutletContext<{ socket: Socket }>();
  const [_, setUser] = useRecoilState(userAtom);

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget[0] as HTMLInputElement;
    // 현재는 입력한다면 사용할 수 있도록 구현
    // 추후 로그인 구현 예정
    socket.emit("login", input.value, () => {
      setUser((prev) =>
        produce(prev, (draft) => {
          draft.name = input.value;
          return draft;
        })
      );
      navigate("/");
    });
  };

  return (
    <form
      onSubmit={handleNameSubmit}
      css={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
      }}
    >
      <Input label="당신의 이름을 입력하세요." css={{ width: "100%" }}></Input>
      <Button type="submit">채팅 참여하기</Button>
    </form>
  );
};

export default LoginContainer;
