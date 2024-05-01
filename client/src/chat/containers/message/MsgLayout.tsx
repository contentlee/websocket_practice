import { ReactNode, useEffect, useRef } from 'react';

interface Props {
  children: ReactNode;
}
const MsgLayout = ({ children }: Props) => {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!!wrapRef.current) {
      wrapRef.current.scrollTop = wrapRef.current.scrollHeight;
    }
  }, [wrapRef.current]);

  return (
    <div
      ref={wrapRef}
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        height: '100%',
        // experimental (checked : 2024-03-22)
        maxHeight: 'fill-available',
        padding: '0 20px',
        margin: '64px 0',
        overflow: 'auto',
      }}
    >
      {children}
    </div>
  );
};

export default MsgLayout;
