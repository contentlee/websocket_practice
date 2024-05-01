import { socket } from '.';

// // socket On
// socket.onSignal('not_found_user');

// // socket Emit
// socket.registerEmit('leave_room', 'room_name', 'user_name', 'callback');
// socket.registerEmit('new_message', 'message', 'room_name', 'user_name', 'callback');
// socket.registerEmit('require_call', 'your_name', 'room_name', 'callback');
// socket.registerEmit('require_video_call', 'your_name', 'room_name', 'callback');

const chatSocket = {
  noFoundUser: (callback: () => void) => socket.receive('not_found_user', callback),
  welcomeRoom: (callback: (user: string) => void) => socket.receive('welcome_room', callback),
  byeRoom: (callback: (user: string) => void) => socket.receive('leave_room', callback),
  receiveNewMessage: (callback: (user: string, msg: string) => void) =>
    socket.receive('new_message', callback),
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
