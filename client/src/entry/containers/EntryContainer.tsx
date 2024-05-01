import { useState } from 'react';
import { EntryLayout } from '../components';
import { Modal } from '@components';
import CreateRoomModal from './create';
import RoomList from './list';

const EntryContainer = () => {
  // Modal
  const [isOpened, setOpened] = useState(false);
  const openModal = () => {
    setOpened(true);
  };
  const closeModal = () => {
    setOpened(false);
  };

  return (
    <EntryLayout>
      <Modal isOpened={isOpened} closeModal={closeModal}>
        <CreateRoomModal closeModal={closeModal} />
      </Modal>
      <RoomList openModal={openModal} />
    </EntryLayout>
  );
};

export default EntryContainer;
