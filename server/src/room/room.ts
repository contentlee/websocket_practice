import { TChat, TRoom } from "../utils/types";

class Room {
  name: string;
  attendee: TRoom["attendee"];
  chats: TChat[];
  curIdx: number;
  maxLength: number;
  unit: number = 20;

  constructor(room: TRoom) {
    this.name = room.name;
    this.attendee = room.attendee;
    this.chats = room.chat;
    this.maxLength = room.max_length;
    this.curIdx = room.chat.length - 1;
  }

  static createRoom(roomName: string, userName: string, maxLength: string, initMsg: string) {
    return {
      name: roomName,
      attendee: [{ user: userName, msg_index: 0 }],
      max_length: parseInt(maxLength),
      init_msg: initMsg,
      chat: [],
    };
  }

  public getRoom = () => {
    return {
      name: this.name,
      attendee: this._getAttendeeNameList(),
      chat: this.chats,
      max_length: this.maxLength,
    };
  };

  public setChats = (userName: string, lastIdx: number = this.curIdx + 1) => {
    const startIdx = this._getChatStartIdx(userName, lastIdx);
    this.curIdx = startIdx;
    this.chats = [...this.chats.slice(startIdx, lastIdx)];
    return this;
  };

  public isAttendee = (userName: string) => {
    return !!this.attendee.find(({ user }) => user === userName);
  };

  public isOverAttendee = () => {
    return this.maxLength < this.attendee.length + 1;
  };

  public _getAttendeeNameList = () => {
    return this.attendee.map((attendee) => attendee.user);
  };

  public _getUserFirstChat = (userName: string) => {
    return this.attendee.find(({ user }) => user === userName)?.msg_index;
  };

  public _getChatStartIdx = (userName: string, lastIdx: number) => {
    const intialIdx = this._getUserFirstChat(userName);
    const startIdx = lastIdx - intialIdx!;
    return startIdx > this.unit ? lastIdx - this.unit : intialIdx!;
  };
}

export default Room;
