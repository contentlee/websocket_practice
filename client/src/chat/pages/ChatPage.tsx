import { PageLayout } from '@components';

import { ChatContext } from '../contexts';
import ChatContainer from '../containers';

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
        <ChatContainer />
      </ChatContext>
    </PageLayout>
  );
};

export default ChatPage;
