import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  isOpened: boolean;
  children: ReactNode;
  closeModal: () => void;
}

const Modal = ({ isOpened, children, closeModal }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (isOpened && !ref.current?.contains(e.target as Node)) closeModal();
    };
    document.addEventListener('mousedown', clickOutside);

    return () => {
      document.removeEventListener('mousedown', clickOutside);
    };
  }, [isOpened]);

  return (
    isOpened &&
    createPortal(
      <div
        ref={ref}
        css={{
          position: 'absolute',
          top: '20px',
        }}
      >
        {children}
      </div>,
      document.body,
    )
  );
};

export default Modal;
