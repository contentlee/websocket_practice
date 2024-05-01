import { HTMLAttributes } from 'react';

import AddIcon from '@assets/add_circle_icon.svg';

import { palette } from '@utils/palette';
import { Icon } from '@components';

interface Props extends HTMLAttributes<HTMLDivElement> {
  openModal: () => void;
}

const CreateRoomButton = ({ openModal, ...props }: Props) => {
  const handleClickCreate = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal();
  };

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
      onClick={handleClickCreate}
      {...props}
    >
      <hr
        css={{
          display: 'flex',
          flex: 'auto',
          height: '0.5px',
          background: palette.gray.gray83,
          border: 'none',
        }}
      />
      <Icon src={AddIcon}></Icon>
      <hr
        css={{
          display: 'flex',
          flex: 'auto',
          height: '0.5px',
          background: palette.gray.gray83,
          border: 'none',
        }}
      />
    </div>
  );
};

export default CreateRoomButton;
