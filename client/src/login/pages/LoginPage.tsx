import { PageLayout } from '@components';

import { LoginContainer } from '../containers';

const LoginPage = () => {
  return (
    <PageLayout
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LoginContainer />
    </PageLayout>
  );
};
export default LoginPage;
