import { createContext, useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import { useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';
import { produce } from 'immer';

import { userAtom } from '@atoms/userAtom';

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

interface Room {
  name: string;
  attendee: { user: string; msg_index: number }[];
  chat: Msg[];
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
  const { socket } = useOutletContext<{ socket: Socket }>();

  const { name: roomName } = useParams();

  const userInfo = useRecoilValue(userAtom);

  const [title, setTitle] = useState({ name: '익명', length: 0 });
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [attendee, setAttendee] = useState<Room['attendee']>([]);
  const [idx, setIdx] = useState(0);

  const handleAddMsg = (msg: Msg) => setMsgs([...msgs, msg]);
  const handleChangeIdx = (idx: number) => setIdx(idx);

  useEffect(() => {
    const { name: myName } = userInfo;

    if (socket && roomName) {
      socket.emit('get_room', roomName, myName, (room: Room, startIndx: number) => {
        setTitle({ name: roomName, length: room.attendee.length });
        setAttendee(room.attendee);
        setIdx(startIndx);

        const chats = room.chat.map((room) => {
          if (room.type === 'message') {
            room.type = room.user === myName ? 'from' : 'to';
          }
          return room;
        });
        setMsgs(chats);
      });
    }

    const welcome = (user: string) => {
      setTitle((prev) =>
        produce(prev, (draft) => {
          draft.length++;
          return draft;
        }),
      );
      setAttendee([...attendee, { user, msg_index: 0 }]);
      handleAddMsg({
        type: 'welcome',
        user,
        msg: `${user} 님이 참여하셨습니다.`,
        date: new Date(),
      });
    };
    socket.on('welcome_room', welcome);

    const leave = (user: string) => {
      setTitle((prev) =>
        produce(prev, (draft) => {
          draft.length--;
          return draft;
        }),
      );

      setAttendee((prev) =>
        produce(prev, (draft) => {
          const index = draft.findIndex((v) => v.user === user);
          draft.splice(index, 1);
          return draft;
        }),
      );
      handleAddMsg({
        type: 'bye',
        user,
        msg: `${user} 님이 퇴장하셨습니다.`,
        date: new Date(),
      });
    };
    socket.on('leave_room', leave);

    const newMessage = (user: string, msg: string) => {
      handleAddMsg({ type: 'to', user, msg, date: new Date() });
    };
    socket.on('new_message', newMessage);

    return () => {
      socket.off('welcome_room', welcome);
      socket.off('leave_room', leave);
      socket.off('new_message', newMessage);
    };
  }, [socket, userInfo, roomName, attendee, navigate]);

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
