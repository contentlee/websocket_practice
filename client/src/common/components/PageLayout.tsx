import { HTMLAttributes, useEffect } from 'react';

import { useAnimate } from '@hooks';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const PageLayout = ({ children, ...props }: Props) => {
  const [animation, setAnimation] = useAnimate();
  useEffect(() => {
    setAnimation({ type: 'fadeIn', callback: () => {} });
  }, [setAnimation]);
  return (
    <div
      css={{
        width: '100%',
        minWidth: '310px',
        maxWidth: '390px',
        height: '100%',
        padding: '20px',
        boxSizing: 'border-box',
        overflow: 'auto',
        animation: animation && animation + '.2s forwards ease-out',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default PageLayout;
