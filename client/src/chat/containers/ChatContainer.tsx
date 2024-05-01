import { Modal } from '@components';
import { ChatLayout } from '../components';
import Header from './header';
import Messages from './message';
import SendForm from './send';
import UserList from './users';
import { useState } from 'react';

const ChatContainer = () => {
  const [isOpened, setOpened] = useState(false);

  const openModal = () => {
    setOpened(true);
  };

  const closeModal = () => {
    setOpened(false);
  };
  return (
    <ChatLayout>
      <Header openModal={openModal} />
      <Messages />
      <SendForm />
      <Modal isOpened={isOpened} closeModal={closeModal}>
        <UserList />
      </Modal>
    </ChatLayout>
  );
};

export default ChatContainer;
