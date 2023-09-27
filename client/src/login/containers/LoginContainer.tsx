import { useRecoilState } from "recoil";
import { produce } from "immer";

import { Input, Button } from "@components";

import { userAtom } from "@atoms/userAtom";

const LoginContainer = () => {
  const [_, setUser] = useRecoilState(userAtom);

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget[0] as HTMLInputElement;
    setUser((prev) =>
      produce(prev, (draft) => {
        draft.name = input.value;
        return draft;
      })
    );
    input.value = "";
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
