import { Info, Room } from '@utils/types';
import { socket } from '.';

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

export default roomSocket;
