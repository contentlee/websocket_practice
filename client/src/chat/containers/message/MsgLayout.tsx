import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { MsgContext } from '../../contexts';

interface Props {
  children: ReactNode;
}
const MsgLayout = ({ children }: Props) => {
  const msgs = useContext(MsgContext);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    if (!!wrapRef.current) {
      if (scrollHeight === 0) {
        wrapRef.current.scrollTo({ top: wrapRef.current.scrollHeight });
      } else {
        const top = wrapRef.current.scrollHeight - scrollHeight;
        wrapRef.current.scrollTo({ top: top });
      }
      setScrollHeight(wrapRef.current?.scrollHeight);
    }
  }, [wrapRef.current, msgs]);

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
