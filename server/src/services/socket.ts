import { ChatModel } from "../models";
import { BaseRoom } from "../utils/types";

class SocketService {
  model = new ChatModel();

  public login(user: string) {}

  public async checkRoom(name: string) {
    const room = await this.model.getRoom(name);
    return room ? true : false;
  }

  public async getRoom(name: string, userName: string) {
    try {
      const room = await this.model.getRoom(name);
      if (!room) throw new Error();

      const user = room.attendee.find((v) => v.user === userName);
      if (!user) return { name, attendee: room.attendee, chat: [] };

      let index = -10;
      if (room.chat.length - user.msg_index - 10 < 0) index = room.chat.length - user.msg_index;

      const res = {
        name,
        attendee: room.attendee,
        chat: room.chat.splice(-index),
      };
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  public async getRooms(user: string = "") {
    const rooms = await this.model.getRooms();

    return rooms.map(({ name, attendee, max_length }) => {
      return { name, attendee, max_length };
    });
  }

  public createRoom(name: string, max_length: string = "100", init_msg: string = "", user: string) {
    const room = {
      name,
      attendee: [{ user, msg_index: 0 }],
      max_length: parseInt(max_length),
      init_msg,
      chat: [],
    };

    return this.model.createRoom(room);
  }

  public async enterRoom(name: string, user: string) {
    try {
      const room = await this.model.getRoom(name);
      if (room && room.max_length! < room.attendee.length + 1) {
        throw new Error();
      }
      if (room?.attendee.find((v) => v.user === user)) return true;

      const chat = {
        type: "welcome",
        date: new Date(),
        msg: `${user} 님이 참여하셨습니다.`,
        user,
      };
      await this.model.addMessage(chat, name);
      await this.model.attendUser(name, user, room ? room.chat.length : 0);

      return false;
    } catch (err) {
      console.log(err);
    }
  }

  public sendMessage(msg: string, room: string, user: string) {
    const chat = {
      type: "message",
      date: new Date(),
      msg,
      user,
    };

    return this.model.addMessage(chat, room);
  }

  public async leaveRoom(name: string, user: string) {
    try {
      const room = await this.model.getRoom(name);
      if (room && 0 >= room.attendee.length - 1) {
        return this.model.deleteRoom(name);
      }

      const chat = {
        type: "bye",
        date: new Date(),
        msg: `${user} 님이 퇴장하셨습니다.`,
        user,
      };
      await this.model.addMessage(chat, name);

      return this.model.leaveUser(name, user);
    } catch (err) {
      console.log(err);
    }
  }
}

export default SocketService;
