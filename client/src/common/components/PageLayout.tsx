import { HTMLAttributes, useEffect, ReactNode } from 'react';

import { useAnimate } from '@hooks';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const PageLayout = ({ children, ...props }: Props) => {
  const [ref, setAnimation] = useAnimate<HTMLDivElement>();
  useEffect(() => {
    setAnimation('fadeIn');
  }, [setAnimation]);

  return (
    <div
      ref={ref}
      css={{
        width: '100%',
        minWidth: '310px',
        maxWidth: '390px',
        height: '100%',
        padding: '20px',
        boxSizing: 'border-box',
        overflow: 'auto',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default PageLayout;
