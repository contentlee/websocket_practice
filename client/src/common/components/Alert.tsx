import { HTMLAttributes } from 'react';

import { palette } from '@utils/palette';

interface Props extends HTMLAttributes<HTMLDivElement> {
  type: 'success' | 'error' | 'warning';
  children?: React.ReactNode;
}

const Alert = ({ type, children, ...props }: Props) => {
  return (
    <div
      css={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '350px',
        height: '2.5em',
        padding: '0 14px',
        gap: '1.25em',
        color: palette.main.wht,
        ...TYPE_VARIANTS[type],
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const TYPE_VARIANTS = {
  success: {
    backgroundColor: palette.point.green,
  },
  error: {
    backgroundColor: palette.point.red,
  },
  warning: {
    backgroundColor: palette.point.yellow,
  },
};

export default Alert;
