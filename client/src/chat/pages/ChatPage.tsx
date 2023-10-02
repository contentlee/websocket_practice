import { PageLayout } from "@components";

import { MsgContainer, SendForm, TitleContainer } from "../containers";

const ChatPage = () => {
  return (
    <PageLayout css={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <TitleContainer />
      <MsgContainer></MsgContainer>
      <SendForm></SendForm>
    </PageLayout>
  );
};

export default ChatPage;
