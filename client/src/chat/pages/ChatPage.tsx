import { PageLayout } from '@components';

import { ChatContext } from '../contexts';
import { MsgContainer, SendForm, TitleContainer, UserListModal } from '../containers';

const ChatPage = () => {
  return (
    <PageLayout
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: 0,
        overflow: 'hidden',
      }}
    >
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
