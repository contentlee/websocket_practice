import { PageLayout } from '@components';

import { ConnectionContext } from '../contexts';
import { VideoContainer } from '../containers';

const VideoPage = () => {
  return (
    <PageLayout>
      <ConnectionContext>
        <VideoContainer />
      </ConnectionContext>
    </PageLayout>
  );
};

export default VideoPage;
