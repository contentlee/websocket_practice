import { HTMLAttributes } from 'react';

import { palette } from '@utils/palette';

interface Props extends HTMLAttributes<HTMLSelectElement> {
  option: MediaDeviceInfo[];
}
const Select = ({ option, ...props }: Props) => {
  return (
    <select
      css={{
        width: '100%',
        height: '42px',
        padding: '0 10px',
        fontFamily: 'pretendard',
        color: palette.main.blk,
        textOverflow: 'ellipsis',
        border: '1.5px solid' + palette.main.blk,
        background: palette.background,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      {...props}
    >
      {option.map(({ deviceId, label }) => {
        return (
          <option
            key={deviceId}
            value={deviceId}
            css={{
              height: '42px',
              padding: '10px',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {label}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
