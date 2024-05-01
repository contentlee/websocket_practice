import { PageLayout } from '@components';

import { CallContainer, VideoContainer } from '../containers';
import ConnectionContext from '../contexts';
import { useLocation } from 'react-router';

const CallPage = () => {
  const { pathname } = useLocation();
  const type = pathname.split('/')[1] === 'video' ? 'video' : 'audio';
  return (
    <PageLayout>
      <ConnectionContext type={type}>
        {type === 'audio' && <CallContainer />}
        {type === 'video' && <VideoContainer />}
      </ConnectionContext>
    </PageLayout>
  );
};

export default CallPage;
