import { Polygon, Regtangle, Spinner } from '@components';
import { palette } from '@utils/palette';

const LoadingItem = () => {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '40px 20px',
        border: '1.5px solid' + palette.main.blk,
        boxSizing: 'border-box',
        gap: '20px',
        fontSize: '16px',
        color: palette.main.blk,
      }}
    >
      <Spinner />
      <div css={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Polygon />
        <div>잠시만 기다려주세요!</div>
        <Regtangle />
      </div>
    </div>
  );
};

export default LoadingItem;
