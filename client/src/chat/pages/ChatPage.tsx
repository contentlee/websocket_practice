import { PageLayout } from "@components";

import { MsgContainer, SendForm, TitleContainer, VideoContainer } from "../containers";

const ChatPage = () => {
  return (
    <PageLayout css={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <TitleContainer />
      <MsgContainer></MsgContainer>
      <VideoContainer></VideoContainer>
      <SendForm></SendForm>
    </PageLayout>
  );
};

export default ChatPage;
