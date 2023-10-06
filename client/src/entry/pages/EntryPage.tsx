import { PageLayout } from "@components";

import { CreateRoomModal, RoomListContainer } from "../containers";
import { Title } from "../components";

const EntryPage = () => {
  return (
    <PageLayout
      css={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
      }}
    >
      <Title>활성화된 채팅방</Title>
      <CreateRoomModal></CreateRoomModal>
      <RoomListContainer></RoomListContainer>
    </PageLayout>
  );
};

export default EntryPage;
