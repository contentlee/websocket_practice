import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const Circle = ({ ...props }: Props) => {
  return (
    <div
      css={{
        width: '14px',
        height: '14px',
        borderRadius: '50px',
      }}
      {...props}
    />
  );
};

export default Circle;
