import { PageLayout } from "@components";

import { MsgContainer, SendForm, TitleContainer } from "../containers";
import { ChatContext } from "../contexts";

const ChatPage = () => {
  return (
    <PageLayout css={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <ChatContext>
        <TitleContainer />
        <MsgContainer></MsgContainer>
        <SendForm></SendForm>
      </ChatContext>
    </PageLayout>
  );
};

export default ChatPage;