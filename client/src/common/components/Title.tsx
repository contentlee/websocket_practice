import { ReactNode } from 'react';
import { palette } from '@utils/palette';

interface Props {
  children: ReactNode;
}

const Title = ({ children }: Props) => {
  return (
    <div
      css={{
        display: 'flex',
        gap: '10px',
        fontSize: '14px',
        color: palette.gray.gray52,
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
};

export default Title;
