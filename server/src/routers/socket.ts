import { Server, Socket } from "socket.io";

import { SocketController } from "../controllers";

class SocketEvent {
  server;
  socket;

  constructor(server: Server, socket: Socket) {
    this.server = server;
    this.socket = socket;
    const controller = new SocketController(this.server, this.socket);

    this.socket.on("login", controller.login);
    this.socket.on("get_room", controller.getRoom);
    this.socket.on("get_rooms", controller.getRooms);

    this.socket.on("create_room", controller.createRoom);
    this.socket.on("enter_room", controller.enterRoom);
    this.socket.on("new_message", controller.sendMessage);
    this.socket.on("leave_room", controller.leaveRoom);
  }
}
export default SocketEvent;
