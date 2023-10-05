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

    this.socket.on("offer", controller.offer);
    this.socket.on("answer", controller.answer);
    this.socket.on("icecandidate", controller.icecandidate);

    this.socket.on("require_call", controller.requireCall);
    this.socket.on("permit_call", controller.permitCall);
    this.socket.on("cancel_call", controller.cancelCall);
    this.socket.on("end_call", controller.endCall);

    this.socket.on("require_video_call", controller.requireVideoCall);
    this.socket.on("permit_video_call", controller.permitVideoCall);
    this.socket.on("cancel_video_call", controller.cancelVideoCall);
    this.socket.on("end_video_call", controller.endVideoCall);
  }
}
export default SocketEvent;
