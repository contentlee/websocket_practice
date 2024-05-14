import { Chat } from '@utils/types';
import { socket } from '.';

const chatSocket = {
  noFoundUser: (callback: () => void) => socket.receive('not_found_user', callback),
  welcomeRoom: (callback: (user: string) => void) => socket.receive('welcome_room', callback),
  byeRoom: (callback: (user: string) => void) => socket.receive('leave_room', callback),
  receiveNewMessage: (callback: (chat: Chat) => void) => socket.receive('new_message', callback),
  sendNewMessage: (message: string, room_name: string, user_name: string, callback: () => void) =>
    socket.send('new_message', message, room_name, user_name, callback),
  leavRoom: (room_name: string, user_name: string, callback: () => void) =>
    socket.send('leave_room', room_name, user_name, callback),
  requireCall: (your_name: string, room_name: string, callback: () => void) =>
    socket.send('require_call', your_name, room_name, callback),
  requireVideoCall: (your_name: string, room_name: string, callback: () => void) =>
    socket.send('require_video_call', your_name, room_name, callback),
};

export default chatSocket;
