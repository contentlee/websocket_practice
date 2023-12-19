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

export const HandlerContext = createContext({
  handleAddMsg: (_: Msg) => {},
});

const ChatContext = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const { name: roomName } = useParams();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const userInfo = useRecoilValue(userAtom);

  const [title, setTitle] = useState({ name: '익명', length: 0 });
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [attendee, setAttendee] = useState<Room['attendee']>([]);

  const handleAddMsg = (msg: Msg) => setMsgs([...msgs, msg]);

  useEffect(() => {
    const { name: myName } = userInfo;

    if (socket && roomName) {
      socket.emit('get_room', roomName, myName, (room: Room) => {
        setTitle({ name: roomName, length: room.attendee.length });
        setAttendee(room.attendee);

        const chats = room.chat.map((room) => {
          if (room.type === 'message') {
            room.type = room.user === myName ? 'from' : 'to';
          }
          return room;
        });
        setMsgs(chats);
      });
    }

    const welcome = (userName: string) => {
      setTitle((prev) =>
        produce(prev, (draft) => {
          draft.length++;
          return draft;
        }),
      );
      setAttendee([...attendee, { user: userName, msg_index: 0 }]);
    };
    socket.on('welcome', welcome);

    const leave = (userName: string) => {
      setTitle((prev) =>
        produce(prev, (draft) => {
          draft.length--;
          return draft;
        }),
      );

      setAttendee((prev) =>
        produce(prev, (draft) => {
          const index = draft.findIndex((v) => v.user === userName);
          draft.splice(index, 1);
          return draft;
        }),
      );
    };
    socket.on('leave', leave);

    return () => {
      socket.off('welcome', welcome);
      socket.off('leave', leave);
    };
  }, [socket, userInfo, roomName, attendee, navigate]);

  return (
    <TitleContext.Provider value={title}>
      <MsgContext.Provider value={msgs}>
        <AttendeeContext.Provider value={attendee}>
          <HandlerContext.Provider value={{ handleAddMsg }}>{children}</HandlerContext.Provider>
        </AttendeeContext.Provider>
      </MsgContext.Provider>
    </TitleContext.Provider>
  );
};

export default ChatContext;
