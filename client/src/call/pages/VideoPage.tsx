import { PageLayout } from '@components';

import { VideoContainer } from '../containers';
import { VideoConnectionContext } from '../contexts';

const VideoPage = () => {
  return (
    <PageLayout>
      <VideoConnectionContext>
        <VideoContainer />
      </VideoConnectionContext>
    </PageLayout>
  );
};

export default VideoPage;
