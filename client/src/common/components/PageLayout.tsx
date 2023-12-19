import { useAnimate } from '@hooks';
import { HTMLAttributes, ReactNode, useEffect, useRef } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const PageLayout = ({ children, ...props }: Props) => {
  // const ref = useRef<HTMLDivElement>(null)
  // const [setRef ,setAnimation] = useAnimate();

  // useEffect(() => {
  //   setRef(ref.current)
  //   setAnimation('fadeIn');
  //   return () => {
  //     setAnimation('fadeOut');
  //   };
  // }, []);
  return (
    <div
      // ref={ref}
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
