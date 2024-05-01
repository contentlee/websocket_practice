import { ChatModel, RoomModel } from "../models";
import { Room } from "../utils/types";
import BaseService from "./base";

class RoomService extends BaseService {
  chatModel = new ChatModel();
  roomModel = new RoomModel();

  public async isThereRoom(name: string) {
    const room = await this.roomModel.getRoom(name);
    return room ? true : false;
  }

  public async getRoom(name: string, userName: string) {
    const room = await this.roomModel.getRoom(name);
    if (!room) throw new Error("not_exist");

    const user = room.attendee.find((v) => v.user === userName);
    if (!user) throw new Error("not_attendee");

    // 최초 요청시 최근 20개만 반환
    const startIdx = this._mkChatIdx(user.msg_index, room.chat.length);
    const chat = room.chat.slice(startIdx);

    return {
      room: {
        name,
        attendee: room.attendee.map((v) => v.user),
        chat,
        max_length: room.max_length,
      },
      startIdx,
    };
  }

  public async getRooms() {
    const rooms = await this.roomModel.getRooms();

    return rooms.map(({ name, attendee, max_length }) => {
      return { name, attendee: attendee.map((v) => v.user), max_length };
    });
  }

  public async createRoom(user: string, { name, max_length = "100", init_msg = "" }: { [index: string]: string }) {
    const duplicated = await this.isThereRoom(name);
    if (duplicated) throw Error("duplicated_name");
    if (Number(max_length) < 0) throw Error("wrong_max");
    const room = {
      name,
      attendee: [{ user, msg_index: 0 }],
      max_length: parseInt(max_length),
      init_msg,
      chat: [],
    };

    return this.roomModel.createRoom(room as Room);
  }

  public async enterRoom(name: string, user: string) {
    const room = await this.roomModel.getRoom(name);
    // 채팅방 제한인원 초과시
    if (room && room.max_length! < room.attendee.length + 1) throw new Error("cannot_attend");
    // 이미 참여한 경우
    if (room?.attendee.find((v) => v.user === user)) return;

    const chat = {
      type: "welcome",
      date: new Date(),
      msg: `${user} 님이 참여하셨습니다.`,
      user,
    };
    await this.chatModel.addMessage(chat, name);
    await this.roomModel.attendUser(name, user, room ? room.chat.length : 0);
  }

  public async leaveRoom(name: string, user: string) {
    const room = await this.roomModel.getRoom(name);

    // 채팅방이 없는 경우
    if (!room) throw new Error("not_exist");
    // 참여자가 아닌 경우
    if (!room?.attendee.find((v) => v.user === user)) throw new Error("cannot_leave");
    // 채팅방의 참여인원이 0인 경우
    if (room && 0 >= room.attendee.length - 1) return this.roomModel.deleteRoom(name);

    const chat = {
      type: "bye",
      date: new Date(),
      msg: `${user} 님이 퇴장하셨습니다.`,
      user,
    };
    await this.chatModel.addMessage(chat, name);
    return this.roomModel.leaveUser(name, user);
  }
}

export default RoomService;
