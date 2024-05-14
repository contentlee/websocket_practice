import { ChatModel, RoomModel } from "../models";
import { Chat, Room } from "../room";

class RoomService {
  chatModel = new ChatModel();
  roomModel = new RoomModel();

  public async isThereRoom(roomName: string) {
    const room = await this.roomModel.getRoom(roomName);
    return room ? true : false;
  }

  public async getRoom(roomName: string, userName: string) {
    const data = await this.roomModel.getRoom(roomName);
    if (!data) throw new Error("not_exist");

    const room = new Room(data);
    if (!room.isAttendee(userName)) throw new Error("not_attendee");

    return {
      room: room.setChats(userName).getRoom(),
      startIdx: room.curIdx,
    };
  }

  public async getRooms() {
    const rooms = await this.roomModel.getRooms();
    return rooms.map((room) => new Room(room).getRoom());
  }

  public async createRoom(user: string, { name, max_length = "100", init_msg = "" }: { [index: string]: string }) {
    const duplicated = await this.isThereRoom(name);
    if (duplicated) throw Error("duplicated_name");
    if (Number(max_length) < 0) throw Error("wrong_max");
    const room = Room.createRoom(name, user, max_length, init_msg);

    return this.roomModel.createRoom(room);
  }

  public async enterRoom(roomName: string, userName: string) {
    const data = await this.roomModel.getRoom(roomName);
    if (!data) throw new Error("not_exist");

    const room = new Room(data);
    if (room.isOverAttendee()) throw new Error("cannot_attend");
    if (room.isAttendee(userName)) return;

    const chat = new Chat().createWelcome(userName);
    await this.chatModel.addMessage(chat, roomName);
    await this.roomModel.attendUser(roomName, userName, room.chats.length);
  }

  public async leaveRoom(roomName: string, userName: string) {
    const data = await this.roomModel.getRoom(roomName);
    if (!data) throw new Error("not_exist");

    const room = new Room(data);
    if (!room.isAttendee(userName)) throw new Error("cannot_leave");
    // 채팅방의 참여인원이 0인 경우
    if (room.attendee.length - 1 <= 0) return this.roomModel.deleteRoom(roomName);

    const chat = new Chat().createLeave(userName);
    await this.chatModel.addMessage(chat, roomName);
    return this.roomModel.leaveUser(roomName, userName);
  }
}

export default RoomService;
