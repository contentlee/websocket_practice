import { Server, Socket } from "socket.io";

import { CallContoller, ChatController, LoginController, RTCController, RoomController } from "../controllers";

class SocketEvent {
  private server;
  private socket;

  constructor(server: Server, socket: Socket) {
    this.server = server;
    this.socket = socket;

    this.initLogin();
    this.initRoom();
    this.initChat();
    this.initForCall();
    this.initForRTC();
  }

  private initLogin() {
    const controller = new LoginController(this.server, this.socket);
    this.socket.on("login", controller.login);
    this.socket.on("disconnect", controller.logout);
  }

  private initRoom() {
    const controller = new RoomController(this.server, this.socket);
    this.socket.on("get_room", controller.getRoom);
    this.socket.on("get_rooms", controller.getRooms);
    this.socket.on("create_room", controller.createRoom);
    this.socket.on("enter_room", controller.enterRoom);
    this.socket.on("leave_room", controller.leaveRoom);
  }

  private initChat() {
    const controller = new ChatController(this.server, this.socket);
    this.socket.on("new_message", controller.sendMessage);
    this.socket.on("get_chats", controller.getChats);
  }

  private initForCall() {
    const controller = new CallContoller(this.server, this.socket);
    this.socket.on("require_call", controller.requireCall);
    this.socket.on("require_video_call", controller.requireVideoCall);
    this.socket.on("permit_call", controller.permitCall);
    this.socket.on("cancel_call", controller.cancelCall);
    this.socket.on("end_call", controller.endCall);
  }

  private initForRTC() {
    const controller = new RTCController(this.server, this.socket);
    this.socket.on("offer", controller.offer);
    this.socket.on("answer", controller.answer);
    this.socket.on("icecandidate", controller.icecandidate);
  }
}
export default SocketEvent;
