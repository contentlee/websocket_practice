import { modalAtom } from '@atoms/stateAtom';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useRecoilValue } from 'recoil';

interface Props {
  name: string;
  children: ReactNode;
}

const ModalContainer = ({ name, children }: Props) => {
  const { isOpened, type } = useRecoilValue(modalAtom);

  return isOpened && name === type && createPortal(<>{children}</>, document.body, type);
};

export default ModalContainer;
