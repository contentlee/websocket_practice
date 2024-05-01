import { MouseEvent } from 'react';
import { Icon } from '..';
import CloseIcon from '@assets/close_icon.svg';
import { useRecoilState } from 'recoil';
import { alertAtom, closeAlert } from '@atoms/alertAtom';

interface Props {
  id: number;
}

const CloseButton = ({ id }: Props) => {
  const [_, setAlert] = useRecoilState(alertAtom);

  const handleClickClose = (e: MouseEvent) => {
    e.preventDefault();
    setAlert(closeAlert(id));
  };
  return <Icon src={CloseIcon} onClick={handleClickClose}></Icon>;
};

export default CloseButton;
