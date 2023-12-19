import { useContext, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Socket } from 'socket.io-client/debug';

import { useAlert, useAnimate } from '@hooks';

import { EnterMsg, FromMsg, ToMsg } from '../components';
import { HandlerContext, MsgContext } from '../contexts/ChatContext';

const MsgContainer = () => {
  const navigate = useNavigate();

  const [_, setAlert] = useAlert();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const wrapRef = useRef<HTMLDivElement>(null);

  const msgs = useContext(MsgContext);
  const { handleAddMsg } = useContext(HandlerContext);

  useEffect(() => {
    const welcome = (user: string) => {
      handleAddMsg({
        type: 'welcome',
        user,
        msg: `${user} 님이 참여하셨습니다.`,
        date: new Date(),
      });
    };
    socket.on('welcome', welcome);

    const newMessage = (user: string, msg: string) => {
      handleAddMsg({ type: 'to', user, msg, date: new Date() });
    };
    socket.on('new_message', newMessage);

    const bye = (user: string) => {
      handleAddMsg({
        type: 'bye',
        user,
        msg: `${user} 님이 퇴장하셨습니다.`,
        date: new Date(),
      });
    };
    socket.on('bye', bye);

    return () => {
      socket.off('welcome', welcome);
      socket.off('new_message', newMessage);
      socket.off('bye', bye);
    };
  }, [handleAddMsg, navigate, setAlert, socket]);

  useEffect(() => {
    if (wrapRef.current) {
      const scrollHeight = wrapRef.current.scrollHeight;
      wrapRef.current.scrollTop = scrollHeight;
    }
  }, [msgs]);

  return (
    <div
      ref={wrapRef}
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '64px 20px 52px',
        overflow: 'auto',
      }}
    >
      {msgs.map(({ type, msg, user }, i) => {
        if (type === 'from') return <FromMsg msg={msg} key={i} />;
        if (type === 'welcome') return <EnterMsg msg={msg} key={i} />;
        if (type === 'bye') return <EnterMsg msg={msg} key={i} />;
        return <ToMsg name={user} msg={msg} key={i} />;
      })}
    </div>
  );
};

export default MsgContainer;
