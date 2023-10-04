import { Server, Socket } from "socket.io";
import { SocketService } from "../services";
import { BaseRoom, RoomInfo } from "../utils/types";

class SocketController {
  service = new SocketService();
  server;
  socket;

  constructor(server: Server, socket: Socket) {
    this.server = server;
    this.socket = socket;
  }

  private requireValidation() {
    return this.socket.emit("need_login");
  }

  public getRoom = async (roomName: string, userName: string, done: (room: BaseRoom) => void) => {
    if (!userName) return this.requireValidation();
    try {
      const room = await this.service.getRoom(roomName, userName);
      if (!room) throw new Error();
      done(room);
    } catch (err) {
      console.log(err);
    }
  };

  public getRooms = async (userName: string, done: (list: RoomInfo[]) => void) => {
    try {
      const rooms = await this.service.getRooms(userName);
      done(rooms);
    } catch (err) {
      console.log(err);
    }
  };

  public login = (userName: string, done: () => void) => {
    this.service.login(userName, this.socket.id);
    done();
  };

  public createRoom = async (
    roomName: string,
    maxLength: string,
    notification: string,
    userName: string,
    done: () => void
  ) => {
    if (!userName) return this.requireValidation();

    const duplicated = await this.service.checkRoom(roomName);
    if (duplicated) return this.socket.emit("duplicated_name");

    try {
      await this.service.createRoom(roomName, maxLength, notification, userName);

      const rooms = await this.service.getRooms();
      this.socket.join(roomName);
      this.server.sockets.emit("change_rooms", rooms);
      done();
    } catch (err) {
      console.log(err);
    }
  };

  public enterRoom = async (roomName: string, userName: string, done: () => void) => {
    if (!userName) return this.requireValidation();

    try {
      const flag = await this.service.enterRoom(roomName, userName);
      this.socket.join(roomName);
      if (!flag) this.socket.to(roomName).emit("welcome", userName);
      done();
    } catch (err) {
      console.log(err);
    }
  };

  public sendMessage = async (message: string, roomName: string, userName: string, done: () => void) => {
    if (!userName) return this.requireValidation();

    try {
      await this.service.sendMessage(message, roomName, userName);
      this.socket.to(roomName).emit("new_message", userName, message);
      done();
    } catch (err) {
      console.log(err);
    }
  };

  public leaveRoom = (roomName: string, userName: string, done: () => void) => {
    try {
      this.service.leaveRoom(roomName, userName);
      this.socket.leave(roomName);
      this.socket.to(roomName).emit("bye", userName);
      done();
    } catch (err) {
      console.log(err);
    }
  };

  public requireCall = (toUserName: string, fromUserName: string, done: () => void) => {
    const userInfo = this.service.findUserId(toUserName);
    if (userInfo) {
      this.socket.join(fromUserName);
      this.socket.to(userInfo.id).emit("require_call", fromUserName);
      done();
    } else {
      this.socket.emit("not_found_user");
    }
  };

  public permitCall = (fromUserName: string, done: () => void) => {
    this.socket.join(fromUserName);
    this.socket.to(fromUserName).emit("permit_call");
    done();
  };

  public cancelCall = (fromUserName: string) => {
    this.socket.to(fromUserName).emit("cancel_call");
  };

  public endCall = (fromUserName: string) => {
    this.socket.leave(fromUserName);
    this.socket.to(fromUserName).emit("end_call");
  };

  public requireVideoCall = (toUserName: string, fromUserName: string, done: () => void) => {
    const userInfo = this.service.findUserId(toUserName);
    if (userInfo) {
      this.socket.join(fromUserName);
      this.socket.to(userInfo.id).emit("require_video_call", fromUserName);
      done();
    } else {
      this.socket.emit("not_found_user");
    }
  };

  public permitVideoCall = (fromUserName: string, done: () => void) => {
    this.socket.join(fromUserName);
    this.socket.to(fromUserName).emit("permit_video_call");
    done();
  };

  public cancelVideoCall = (fromUserName: string) => {
    this.socket.to(fromUserName).emit("cancel_video_call");
  };

  public endVideoCall = (fromUserName: string) => {
    this.socket.leave(fromUserName);
    this.socket.to(fromUserName).emit("end_video_call");
  };

  public disconnecting = () => {
    this.service.disconnecting(this.socket.id);
  };
}

export default SocketController;
