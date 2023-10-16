import { HTMLAttributes } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';

import { modalAtom } from '@atoms/stateAtom';
import { palette } from '@utils/palette';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const Overlay = ({ ...props }: Props) => {
  const { isOpened } = useRecoilValue(modalAtom);
  const resetModal = useResetRecoilState(modalAtom);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    resetModal();
  };

  return isOpened ? (
    <div
      css={{
        zIndex: '500',
        position: 'absolute',
        display: 'block',
        width: '100%',
        height: '100%',
        background: palette.background,
        opacity: '30%',
      }}
      onClick={handleClick}
      {...props}
    ></div>
  ) : (
    <></>
  );
};

export default Overlay;
