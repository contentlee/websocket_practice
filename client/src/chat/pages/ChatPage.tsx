import { PageLayout } from "@components";
import { MsgContainer, SendForm } from "../containers";
import { RoomTitle } from "../components";

const ChatPage = () => {
  return (
    <PageLayout>
      <RoomTitle name="익명" length={2}></RoomTitle>
      <MsgContainer></MsgContainer>
      <SendForm css={{}}></SendForm>
    </PageLayout>
  );
};

export default ChatPage;
