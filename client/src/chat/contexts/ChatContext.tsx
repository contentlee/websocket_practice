import { createContext, useCallback, useEffect, useState } from 'react';

import { useRecoilValue } from 'recoil';

import { userAtom } from '@atoms/userAtom';
import { Chat, Msg, Room } from '@utils/types';

import { chatSocket } from '@socket';

interface Msgs {
  msgs: Msg[];
  type: 'init' | 'new' | 'send' | 'previous';
}

export const TitleContext = createContext({
  name: '익명',
  length: 0,
});

export const MsgContext = createContext<Msgs>({
  msgs: [],
  type: 'init',
});

export const AttendeeContext = createContext<Room['attendee']>([]);

export const HandlerContext = createContext({
  addMsg: (_: Msg) => {},
  roomInit: (_: Room) => {},
  addPreviousChats: (_: Chat[]) => {},
});

const ChatContext = ({ children }: { children: React.ReactNode }) => {
  const { name: myName } = useRecoilValue(userAtom);

  const [title, setTitle] = useState({ name: '익명', length: 0 });
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [attendee, setAttendee] = useState<string[]>([]);
  const [msgType, setMsgType] = useState<'init' | 'new' | 'previous' | 'send'>('init');

  const addMsg = (msg: Msg) => {
    setMsgs([...msgs, msg]);
    setMsgType('send');
  };

  const addPreviousChats = (chats: Chat[]) => {
    const arr = chats.map((c) => {
      if (c.type === 'message') {
        c.type = c.user === myName ? 'from' : 'to';
      }
      return c;
    });
    setMsgs((m) => [...arr, ...m]);
    setMsgType('previous');
  };

  const roomInit = (room: Room) => {
    setTitle({ name: room.name, length: room.attendee.length });
    setAttendee(room.attendee);
    if (room.chat) addPreviousChats(room.chat);
  };

  useEffect(() => {
    const welcome = (user: string) => {
      setTitle((prev) => {
        return { name: prev.name, length: prev.length + 1 };
      });
      setAttendee([...attendee, user]);
      addMsg({
        type: 'welcome',
        user,
        msg: `${user} 님이 참여하셨습니다.`,
        date: new Date(),
      });
      setMsgType('new');
    };

    const leave = (user: string) => {
      setTitle((prev) => {
        return { name: prev.name, length: prev.length - 1 };
      });

      setAttendee((prev) => {
        const tmp = [...prev];
        const index = prev.findIndex((name) => name === user);
        tmp.splice(index, 1);
        return tmp;
      });
      addMsg({
        type: 'bye',
        user,
        msg: `${user} 님이 퇴장하셨습니다.`,
        date: new Date(),
      });
      setMsgType('new');
    };

    const newMessage = ({ user, date, msg }: Chat) => {
      addMsg({ type: 'to', user, date, msg });
      setMsgType('new');
    };

    // roomSocket.getRoom(roomName!, myName, getRoom);
    chatSocket.welcomeRoom(welcome).on();
    chatSocket.byeRoom(leave).on();
    chatSocket.receiveNewMessage(newMessage).on();

    return () => {
      chatSocket.welcomeRoom(welcome).off();
      chatSocket.byeRoom(leave).off();
      chatSocket.receiveNewMessage(newMessage).off();
    };
  }, [addMsg]);

  return (
    <TitleContext.Provider value={title}>
      <MsgContext.Provider value={{ msgs, type: msgType }}>
        <AttendeeContext.Provider value={attendee}>
          <HandlerContext.Provider value={{ addMsg, roomInit, addPreviousChats }}>
            {children}
          </HandlerContext.Provider>
        </AttendeeContext.Provider>
      </MsgContext.Provider>
    </TitleContext.Provider>
  );
};

export default ChatContext;
