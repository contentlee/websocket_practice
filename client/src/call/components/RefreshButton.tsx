import { Button, Icon } from '@components';
import RetryIcon from '@assets/refresh_icon_wht.svg';
import { MouseEvent } from 'react';

interface Props {
  refresh: () => Promise<void | MediaStreamTrack>;
}

const RefreshButton = ({ refresh }: Props) => {
  const handleClickRetry = (e: MouseEvent) => {
    e.preventDefault();
    refresh();
  };
  return (
    <Button
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px',
        width: '100%',
      }}
    >
      <Icon src={RetryIcon} alt="retry" onClick={handleClickRetry} />
      <div>미디어 접근 권한에 대해 새로고침 </div>
    </Button>
  );
};

export default RefreshButton;
