import { Server, Socket } from "socket.io";
import { RoomInfo } from "../utils/types";
import Service from "./service";
import Middleware from "./middleware";
import WsServer from "./server";

class Events {
  middleware;
  service;

  constructor() {
    this.middleware = new Middleware();
    this.service = new Service();

    WsServer.socket.on("show_room", this.showRoom);
    WsServer.socket.on("count_member", this.countMember);
    WsServer.socket.on("login", this.login);
    WsServer.socket.on("create_room", this.createRoom);
    WsServer.socket.on("enter_room", this.enterRoom);
    WsServer.socket.on("new_message", this.sendMessage);
    WsServer.socket.on("disconnecting", this.disconnection);
  }

  private showRoom = (done: (list: RoomInfo[]) => void) => {
    done(this.service.getRooms());
  };

  public countMember = (roomName: string, done: (val: number) => void) => {
    if (!this.service.checkRoom(roomName)) return this.middleware.requireValidation();
    done(this.service.countMember(roomName));
  };

  public login = (userName: string, done: () => void) => {
    WsServer.socket.data.userName = userName;
    done();
  };

  public createRoom = (roomName: string, maxLength: number, notification: string, done: () => void) => {
    if (!this.middleware.checkUserName()) return this.middleware.requireValidation();
    if (this.service.checkRoom(roomName)) return WsServer.socket.emit("duplicated_name");

    WsServer.socket.join(roomName);
    WsServer.server.sockets.emit("change_rooms", this.service.getRooms());
    done();
  };

  public enterRoom = (roomName: string, done: () => void) => {
    if (!this.middleware.checkUserName()) return this.middleware.requireValidation();

    WsServer.socket.join(roomName);
    WsServer.socket.to(roomName).emit("welcome", WsServer.socket.data.userName);
    done();
  };

  public sendMessage = (message: string, room: string, done: () => void) => {
    if (!this.middleware.checkUserName()) return this.middleware.requireValidation();
    WsServer.socket.to(room).emit("new_message", WsServer.socket.data.userName, message);
    WsServer.socket.emit("my_message", message);
    done();
  };

  public disconnection = () => {
    WsServer.socket.rooms?.forEach((room) => WsServer.socket.to(room).emit("bye", WsServer.socket.data.userName));
  };
}

export default Events;
