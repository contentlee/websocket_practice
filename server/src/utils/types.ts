export interface TChat {
  type: string;
  date: Date;
  msg: string;
  user: string;
}

export interface TBaseRoom {
  name: string;
  attendee: { user: string; msg_index: number }[];
  chat: TChat[];
}
export interface TRoom extends TBaseRoom {
  max_length: number;
  init_msg: string;
}

export interface TRoomsInfo {
  name: string;
  attendee: string[];
  max_length: number;
}

export interface TRoomInfo {
  name: string;
  attendee: string[];
  chat: TChat[];
}
