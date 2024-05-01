import { useContext } from 'react';

import { palette } from '@utils/palette';

import { AttendeeContext, TitleContext } from '../../contexts';

interface Props {
  openModal: () => void;
}

const RoomTitle = ({ openModal }: Props) => {
  const title = useContext(TitleContext);
  const attendee = useContext(AttendeeContext);

  const handleClickTitle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (attendee.length >= 2) openModal();
  };

  return (
    <div
      onClick={handleClickTitle}
      css={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        color: palette.main.blk,
        boxSizing: 'border-box',
        userSelect: 'none',
        cursor: 'pointer',
      }}
    >
      {title.name ? title.name : '익명의 채팅방'}({title.length})
    </div>
  );
};
export default RoomTitle;
