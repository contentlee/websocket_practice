import { useContext } from 'react';

import { EnterMsg, FromMsg, MoreAndMore, MsgLayout, ToMsg } from '.';
import { MsgContext } from '../../contexts';

const Messages = () => {
  const msgs = useContext(MsgContext);

  return (
    <MsgLayout>
      <MoreAndMore />
      {msgs.map(({ type, msg, user }, i) => {
        if (type === 'from') return <FromMsg msg={msg} key={i} />;
        if (type === 'welcome') return <EnterMsg msg={msg} key={i} />;
        if (type === 'bye') return <EnterMsg msg={msg} key={i} />;
        return <ToMsg name={user} msg={msg} key={i} />;
      })}
    </MsgLayout>
  );
};

export default Messages;
