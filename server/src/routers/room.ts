import { Server, Socket } from "socket.io";
import BaseRoute from "./base";
import { RoomController } from "../controllers";

class RoomRoute extends BaseRoute {
  private controller;
  constructor(server: Server, socket: Socket) {
    super(socket);
    this.controller = new RoomController(server, socket);
    this.path = "room";
    this.initSocket();
  }

  initHttp = () => {
    this.routes = [
      ["get", "/:room_name", [this.controller.getRoom]],
      ["get", "/", [this.controller.getRooms]],
    ];
    this.route();
  };

  initSocket = () => {
    this.socket.on("get_room", this.controller.getRoom);
    this.socket.on("get_rooms", this.controller.getRooms);
    this.socket.on("create_room", this.controller.createRoom);
    this.socket.on("enter_room", this.controller.enterRoom);
    this.socket.on("leave_room", this.controller.leaveRoom);
  };
}

export default RoomRoute;
