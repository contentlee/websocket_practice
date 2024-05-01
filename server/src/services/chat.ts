import { ChatModel, RoomModel } from "../models";
import BaseService from "./base";

class ChatService extends BaseService {
  private roomModel = new RoomModel();
  private chatModel = new ChatModel();

  public async getChats(roomName: string, userName: string, endIdx: number) {
    const room = await this.roomModel.getRoom(roomName);
    if (!room) throw new Error("not_exist");

    const user = room.attendee.find((v) => v.user === userName);
    if (!user) throw new Error("not_attendee");

    const startIdx = this._mkChatIdx(user.msg_index, endIdx);

    return { chats: room.chat.slice(startIdx, endIdx), startIdx };
  }

  public sendMessage(msg: string, room: string, user: string) {
    const chat = {
      type: "message",
      date: new Date(),
      msg,
      user,
    };

    return this.chatModel.addMessage(chat, room);
  }
}

export default ChatService;
