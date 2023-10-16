import { Server, Socket } from "socket.io";
import { SocketService } from "../services";
import { BaseRoom, RoomInfo } from "../utils/types";
import { clients } from "../utils/context";

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

  public login = (userName: string, done: () => void) => {
    if (!userName) return this.socket.emit("need_login");

    const userIndex = this.service.getUserIndex(userName);
    if (userIndex >= 0) this.service.refresh(userIndex, this.socket.id);
    else this.service.login(userName, this.socket.id);
    done();
  };

  // for chat
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
      if (!flag) {
        this.socket.to(roomName).emit("welcome", userName);
      }
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

  public leaveRoom = async (roomName: string, userName: string, done: () => void) => {
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


  public permitCall = (fromUserName: string, done: () => void) => {
    this.socket.join(fromUserName);
    this.socket.to(fromUserName).emit("permit_call");
    done();
  };

  public offer = (roomName: string, offer: RTCSessionDescriptionInit, done: () => void) => {
    this.socket.to(roomName).emit("offer", offer);
    done();
  };

  public answer = (fromName: string, answer: RTCSessionDescriptionInit, done: () => void) => {
    const userInfo = this.service.findUserId(fromName);
    if (userInfo) {
      this.socket.to(userInfo.id).emit("answer", answer);
      done();
    } else {
      this.socket.emit("exit_from_user");
    }
  };

  public icecandidate = (roomName: string, ice: RTCPeerConnectionIceEvent) => {
    this.socket.to(roomName).emit("icecandidate", ice);
  };

  public cancelCall = (fromUserName: string, done: () => void) => {
    this.socket.to(fromUserName).emit("cancel_call");
    done();
  };

  public endCall = (fromUserName: string, done: () => void) => {
    this.socket.leave(fromUserName);
    this.socket.to(fromUserName).emit("end_call");
    done();
  };

  public disconnecting = () => {
    this.service.disconnecting(this.socket.id);
  };
}

export default SocketController;
