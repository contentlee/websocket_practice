import { HTMLAttributes, ClassAttributes, ReactNode } from 'react';
import { palette } from '@utils/palette';

interface Props extends HTMLAttributes<HTMLFormElement>, ClassAttributes<HTMLFormElement> {
  children: ReactNode;
}

const ModalForm = ({ children, ...props }: Props) => {
  return (
    <form
      css={{
        zIndex: 1000,
        position: 'absolute',
        top: '20px',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: '290px',
        maxWidth: '370px',
        padding: '20px',
        gap: '16px',
        border: '1.5px solid' + palette.main.blk,
        background: palette.background,
        boxSizing: 'border-box',
      }}
      {...props}
    >
      {children}
    </form>
  );
};

export default ModalForm;
