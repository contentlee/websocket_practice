import { Chat } from '@utils/types';
import { http } from './http';

interface Response {
  chats: Chat[];
  start_idx: string;
}

export const getChats = (room_name: string, end_idx: number): Promise<Response> =>
  http.get(`/rooms/${room_name}/chats/${end_idx}`);
