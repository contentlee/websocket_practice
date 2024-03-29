import { HTMLAttributes } from 'react';

import { palette } from '@utils/palette';
import { Regtangle } from '@components';

interface Props extends HTMLAttributes<HTMLDivElement> {
  name?: string;
  length: number;
}

const RoomTitle = ({ name = '익명의 채팅방', length, ...props }: Props) => {
  return (
    <div
      {...props}
      css={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: palette.main.blk,
        boxSizing: 'border-box',
        userSelect: 'none',
        cursor: 'pointer',
      }}
    >
      <Regtangle></Regtangle>
      {name}({length})
    </div>
  );
};
export default RoomTitle;
