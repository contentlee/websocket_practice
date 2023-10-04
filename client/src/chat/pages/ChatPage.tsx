import { PageLayout } from "@components";

import { MsgContainer, SendForm, TitleContainer, UserListModal } from "../containers";
import { ChatContext } from "../contexts";

const ChatPage = () => {
  return (
    <PageLayout css={{ display: "flex", flexDirection: "column", gap: "20px", padding: 0, overflow: "hidden" }}>
      <ChatContext>
        <TitleContainer />
        <MsgContainer></MsgContainer>
        <SendForm></SendForm>
        <UserListModal></UserListModal>
      </ChatContext>
    </PageLayout>
  );
};

export default ChatPage;
