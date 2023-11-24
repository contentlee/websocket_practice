import { ButtonHTMLAttributes, ReactNode } from 'react';

import { palette } from '@utils/palette';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'secondary';
  children?: ReactNode;
}

const Button = ({ color = 'primary', children, ...props }: Props) => {
  return (
    <button
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '42px',
        padding: '0 24px',
        boxSizing: 'border-box',
        transition: '.2s',
        cursor: 'pointer',
        fontSize: '14px',
        fontFamily: 'pretendard',
        whiteSpace: 'nowrap',
        ...COLOR_VARIANTS[color],
      }}
      {...props}
    >
      {children}
    </button>
  );
};

const COLOR_VARIANTS = {
  primary: {
    color: palette.main.wht,
    backgroundColor: palette.main.blk,

    '&:hover': {
      backgroundColor: palette.point.blue,
    },
  },
  secondary: {
    border: '1.5px solid transparent',
    color: palette.main.blk,
    backgroundColor: palette.background,
    borderColor: palette.main.blk,
    '&:hover': {
      color: palette.main.wht,
      backgroundColor: palette.point.red,
      borderColor: palette.point.red,
    },
  },
};

export default Button;
