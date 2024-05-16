import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { MsgContext } from '../../contexts';

interface Props {
  children: ReactNode;
}
const MsgLayout = ({ children }: Props) => {
  const { msgs, type } = useContext(MsgContext);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    if (!!wrapRef.current) {
      const currentHeight = wrapRef.current.scrollHeight;
      if (type === 'init' && scrollHeight === 0) {
        wrapRef.current.scrollTo({ top: currentHeight });
      }
      if (type === 'previous') {
        const top = currentHeight - scrollHeight;
        wrapRef.current.scrollTo({ top: top });
      }
      if (type === 'send') {
        wrapRef.current.scrollTo({ top: currentHeight });
      }
      setScrollHeight(currentHeight);
    }
  }, [msgs]);

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
