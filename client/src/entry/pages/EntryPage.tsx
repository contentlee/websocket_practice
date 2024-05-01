import { Circle, PageLayout, Title } from '@components';

import EntryContainer from '../containers';

import { palette } from '@utils/palette';

const EntryPage = () => {
  return (
    <PageLayout
      css={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
      }}
    >
      <Title>
        <div>활성화된 채팅방</div>
        <Circle css={{ background: palette.point.green }} />
      </Title>
      <EntryContainer />
    </PageLayout>
  );
};

export default EntryPage;
