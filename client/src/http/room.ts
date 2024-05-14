import { Room } from '@utils/types';
import { http } from './http';

interface RoomResponse {
  room: Room;
  start_idx: string;
}

export const getRoom = (roomName: string): Promise<RoomResponse> => http.get(`rooms/${roomName}`);

interface RoomsResponse {
  rooms: Room[];
}
export const getRooms = (): Promise<RoomsResponse> => http.get('/rooms');
