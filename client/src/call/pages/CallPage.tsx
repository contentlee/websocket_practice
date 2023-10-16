import { PageLayout } from '@components';

import { ConnectionContext } from '../contexts';
import { CallContainer } from '../containers';

const CallPage = () => {
  return (
    <PageLayout>
      <ConnectionContext>
        <CallContainer />
      </ConnectionContext>
    </PageLayout>
  );
};

export default CallPage;
