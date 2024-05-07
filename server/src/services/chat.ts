import { Chat } from "../chat";
import { ChatModel, RoomModel } from "../models";
import { Room } from "../room";

class ChatService {
  private roomModel = new RoomModel();
  private chatModel = new ChatModel();

  public async getChats(roomName: string, userName: string, lastIdx: number) {
    const data = await this.roomModel.getRoom(roomName);
    if (!data) throw new Error("not_exist");

    const room = new Room(data);
    if (!room.isAttendee(userName)) throw new Error("not_attendee");

    const { chats, curIdx } = room.setChats(userName, lastIdx);

    return { chats, startIdx: curIdx };
  }

  public async sendMessage(msg: string, room: string, user: string) {
    const chat = new Chat().createMsg(msg, user);
    await this.chatModel.addMessage(chat, room);
    return chat;
  }
}

export default ChatService;
