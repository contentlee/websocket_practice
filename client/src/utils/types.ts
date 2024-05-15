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

interface Msg {
  type: string;
  date: Date;
  msg: string;
  user: string;
}

export type { Chat, Info, Room, Msg };
