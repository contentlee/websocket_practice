import { ReactNode, useEffect, useRef, useState } from 'react';

interface Props {
  children: ReactNode;
}
const MsgLayout = ({ children }: Props) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    if (!!wrapRef.current) {
      if (scrollHeight === 0) {
        wrapRef.current.scrollTo({ top: wrapRef.current.scrollHeight });
      } else {
        const height = wrapRef.current.scrollHeight - scrollHeight;
        wrapRef.current.scrollTo({ top: height });
      }
      setScrollHeight(wrapRef.current.scrollHeight);
    }
  }, [wrapRef.current, children]);

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
