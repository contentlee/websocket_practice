import { PageLayout } from '@components';

import { CallContainer } from '../containers';
import { CallConnectionContext } from '../contexts';

const CallPage = () => {
  return (
    <PageLayout>
      <CallConnectionContext>
        <CallContainer />
      </CallConnectionContext>
    </PageLayout>
  );
};

export default CallPage;
