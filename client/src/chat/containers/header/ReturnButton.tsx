import { useNavigate } from 'react-router';

import { Icon } from '@components';

import BackArrowIcon from '@assets/back_arrow_icon.svg';
import { MouseEvent } from 'react';

const ReturnButton = () => {
  const navigate = useNavigate();
  const handleClickBack = (e: MouseEvent) => {
    e.preventDefault();
    navigate(-1);
  };

  return <Icon onClick={handleClickBack} size="small" src={BackArrowIcon} alt="back" />;
};

export default ReturnButton;
