import { ExitButton, HeaderLayout, ReturnButton, RoomTitle } from '.';

interface Props {
  openModal: () => void;
}

const Header = ({ openModal }: Props) => {
  return (
    <HeaderLayout>
      <ReturnButton />
      <RoomTitle openModal={openModal} />
      <ExitButton />
    </HeaderLayout>
  );
};

export default Header;
