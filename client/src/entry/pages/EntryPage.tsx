import { useRecoilValue } from "recoil";

import { modalAtom } from "@atoms/stateAtom";

import { PageLayout } from "@components";

import { CreateRoomModal, RoomListContainer } from "../containers";
import { Title } from "../components";

const EntryPage = () => {
  const modal = useRecoilValue(modalAtom);
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
      {modal.isOpened && modal.type === "create" && <CreateRoomModal></CreateRoomModal>}
      <RoomListContainer></RoomListContainer>
    </PageLayout>
  );
};

export default EntryPage;
