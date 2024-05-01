import { ChangeEvent, useRef } from 'react';

import { palette } from '@utils/palette';

const InputMsg = () => {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const handleResize = (e: ChangeEvent) => {
    e.preventDefault();
    if (textarea.current) {
      textarea.current.style.height = 'auto';
      textarea.current.style.height = textarea.current.scrollHeight + 'px';
    }
  };
  return (
    <textarea
      ref={textarea}
      rows={1}
      css={{
        flex: 1,
        minHeight: '42px',
        padding: '9px 20px',
        outline: 'none',
        border: `1.5px solid ${palette.main.blk}`,
        boxSizing: 'border-box',
        fontSize: '14px',
        fontFamily: 'pretendard',
        color: palette.main.blk,

        resize: 'none',
        overflow: 'hidden',
        background: palette.background,
      }}
      onChange={handleResize}
    />
  );
};

export default InputMsg;
