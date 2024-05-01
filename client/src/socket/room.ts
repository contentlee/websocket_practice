import { socket } from '.';

// // socket On
// socket.onSignal('change_rooms');

// socket.onSignal('duplicated_name');
// socket.onSignal('wrong_max');

// // socket Emit
// socket.registerEmit('get_rooms');
// socket.registerEmit('enter_room', 'room_name', 'user_name', 'callback');
// socket.registerEmit('create_room', 'user_name', 'info', 'callback');

interface Chat {
  type: string;
  date: Date;
  msg: string;
  user: string;
}

interface Info {
  name: string;
  max_length: number;
  init_msg: string;
}

interface Room {
  name: string;
  attendee: string[];
  chat?: Chat[];
  max_length?: number;
}

const roomSocket = {
  changeRooms: (callback: (list: Room[]) => void) => socket.receive('change_rooms', callback),
  duplicatedName: (callback: () => void) => socket.receive('duplicated_name', callback),
  wrongMax: (callback: () => void) => socket.receive('wrong_max', callback),
  getRoom: (room_name: string, user_name: string, callback: (room: Room, start: number) => void) =>
    socket.send('get_room', room_name, user_name, callback),
  getRooms: (user_name: string, callback: (list: Room[]) => void) =>
    socket.send('get_rooms', user_name, callback),
  enterRooms: (room_name: string, user_name: string, callback: () => void) =>
    socket.send('enter_room', room_name, user_name, callback),
  createRoom: (user_name: string, info: Info, callback: () => void) =>
    socket.send('create_room', user_name, info, callback),
};

export type { Room, Chat };

export default roomSocket;
