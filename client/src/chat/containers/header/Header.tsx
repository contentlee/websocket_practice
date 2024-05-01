import { palette } from '@utils/palette';

import { ExitButton, ReturnButton, RoomTitle } from '.';

interface Props {
  openModal: () => void;
}

const Header = ({ openModal }: Props) => {
  return (
    <div
      css={{
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        top: 0,
        left: 0,
        boxSizing: 'border-box',
        background: palette.background,
      }}
    >
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '390px',
          minWidth: '310px',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        <ReturnButton />
        <RoomTitle openModal={openModal} />
        <ExitButton />
      </div>
    </div>
  );
};

export default Header;
