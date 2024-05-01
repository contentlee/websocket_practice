export interface Chat {
  type: string;
  date: Date;
  msg: string;
  user: string;
}

export interface BaseRoom {
  name: string;
  attendee: { user: string; msg_index: number }[];
  chat: Chat[];
}
export interface Room extends BaseRoom {
  max_length: number;
  init_msg: string;
}

export interface RoomInfo {
  name: string;
  attendee: { user: string; msg_index: number }[];
  max_length: number;
}
