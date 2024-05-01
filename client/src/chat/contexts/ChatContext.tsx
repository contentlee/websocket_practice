import { createContext, useCallback, useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router';

import { useRecoilValue } from 'recoil';

import { userAtom } from '@atoms/userAtom';
import { chatSocket, roomSocket } from '@socket';
import { Room } from 'src/socket/room';

export const TitleContext = createContext({
  name: '익명',
  length: 0,
});

export interface Msg {
  type: string;
  date: Date;
  msg: string;
  user: string;
}
export const MsgContext = createContext<Msg[]>([]);

export const AttendeeContext = createContext<Room['attendee']>([]);

export const ChatIdxContext = createContext(0);

export const HandlerContext = createContext({
  handleAddMsg: (_: Msg) => {},
  handleChangeIdx: (_: number) => {},
});

const ChatContext = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { name: roomName } = useParams();

  const { name: myName } = useRecoilValue(userAtom);

  const [title, setTitle] = useState({ name: '익명', length: 0 });
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [attendee, setAttendee] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  const handleAddMsg = useCallback((msg: Msg) => setMsgs([...msgs, msg]), [msgs]);
  const handleChangeIdx = (idx: number) => setIdx(idx);

  useEffect(() => {
    const getRoom = (room: Room, startIndx: number) => {
      setTitle({ name: roomName!, length: room.attendee.length });
      setAttendee(room.attendee);
      setIdx(startIndx);

      const chats = room.chat?.map((room) => {
        if (room.type === 'message') {
          room.type = room.user === myName ? 'from' : 'to';
        }
        return room;
      });
      if (chats) setMsgs(chats);
    };

    const welcome = (user: string) => {
      setTitle((prev) => {
        return { name: prev.name, length: prev.length + 1 };
      });
      setAttendee([...attendee, user]);
      handleAddMsg({
        type: 'welcome',
        user,
        msg: `${user} 님이 참여하셨습니다.`,
        date: new Date(),
      });
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
      handleAddMsg({
        type: 'bye',
        user,
        msg: `${user} 님이 퇴장하셨습니다.`,
        date: new Date(),
      });
    };

    const newMessage = (user: string, msg: string) => {
      handleAddMsg({ type: 'to', user, msg, date: new Date() });
    };

    roomSocket.getRoom(roomName!, myName, getRoom);
    chatSocket.welcomeRoom(welcome).on();
    chatSocket.byeRoom(leave).on();
    chatSocket.receiveNewMessage(newMessage).on();

    return () => {
      chatSocket.welcomeRoom(welcome).off();
      chatSocket.byeRoom(leave).off();
      chatSocket.receiveNewMessage(newMessage).off();
    };
  }, [myName, roomName, attendee, navigate, handleAddMsg]);

  return (
    <TitleContext.Provider value={title}>
      <MsgContext.Provider value={msgs}>
        <AttendeeContext.Provider value={attendee}>
          <ChatIdxContext.Provider value={idx}>
            <HandlerContext.Provider value={{ handleAddMsg, handleChangeIdx }}>
              {children}
            </HandlerContext.Provider>
          </ChatIdxContext.Provider>
        </AttendeeContext.Provider>
      </MsgContext.Provider>
    </TitleContext.Provider>
  );
};

export default ChatContext;
