import { HTMLAttributes, ClassAttributes, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement>, ClassAttributes<HTMLDivElement> {
  children: ReactNode;
}

const AlertLayout = ({ children, ...props }: Props) => {
  return (
    <div
      css={{
        zIndex: 1000,
        position: 'absolute',
        top: '20px',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AlertLayout;
