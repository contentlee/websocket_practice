import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { EnterMsg, FromMsg, MsgLayout, MoreAndMore, ToMsg } from '.';
import { HandlerContext, MsgContext } from '../../contexts';

import { getChats } from '@http/chat';
import { getRoom } from '@http/room';

import Io from '@utils/io';

const Messages = () => {
  const { name: roomName } = useParams();

  const { msgs } = useContext(MsgContext);
  const { roomInit, addPreviousChats } = useContext(HandlerContext);

  const [isLast, setLast] = useState(false);

  const io = new Io({ notWorkOnInit: true, workOnOnlyIntersecting: true });

  const requirePreviousChats = (idx: number) => async () => {
    if (isLast) return;
    const { chats, start_idx } = await getChats(roomName!, idx);
    if (idx === +start_idx) {
      setLast(true);
      return;
    }

    if (chats) {
      addPreviousChats(chats);
    }
    io.enqueueFn(requirePreviousChats(+start_idx));
  };

  useEffect(() => {
    getRoom(roomName!).then(({ room, start_idx }) => {
      roomInit(room);
      io.enqueueFn(requirePreviousChats(+start_idx));
    });
  }, []);

  return (
    <MsgLayout>
      {!isLast && <MoreAndMore io={io} />}
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
