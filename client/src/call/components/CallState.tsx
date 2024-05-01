import { palette } from '@utils/palette';

interface Props {
  state: 'connect' | 'waiting' | 'need_mic';
}

const CallState = ({ state }: Props) => {
  return (
    <div
      css={{
        padding: '16px 32px',
        background:
          state === 'connect'
            ? palette.point.green
            : state === 'waiting'
            ? palette.point.red
            : palette.point.yellow,
        color: palette.main.wht,
        fontSize: '16px',
        fontWeight: 700,
        userSelect: 'none',
      }}
    >
      {state === 'connect' && '통화중'}
      {state === 'waiting' && '연결중'}
      {state === 'need_mic' && '마이크에 대한 접근이 필요합니다.'}
    </div>
  );
};

export default CallState;
