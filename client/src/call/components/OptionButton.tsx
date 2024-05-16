import { HTMLAttributes, MouseEvent } from 'react';

import OptionIcon from '@assets/settings_icon.svg';

import { Button, Icon } from '@components';

interface Props extends HTMLAttributes<HTMLDivElement> {
  openModal: () => void;
}

const OptionButton = ({ openModal, ...props }: Props) => {
  const handleOpenOption = (e: MouseEvent) => {
    e.preventDefault();
    openModal();
  };
  return (
    <div {...props}>
      <Button css={{ width: '100%' }} onClick={handleOpenOption}>
        <Icon src={OptionIcon} alt="option" />
      </Button>
    </div>
  );
};

export default OptionButton;
