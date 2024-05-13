import { ChatController } from "../controllers";
import BaseRoute from "./base";
import { Server, Socket } from "socket.io";

class ChatRoute extends BaseRoute {
  private controller;
  constructor(server: Server, socket: Socket) {
    super(socket);
    this.controller = new ChatController(server, socket);
    this.path = "/chats";

    this.initHttp();
    this.initSocket();
  }

  initHttp = () => {
    this.routes = [["get", "/:roomname/:idx", [this.controller.getChats]]];
    this.route();
  };

  initSocket = () => {
    this.socket.on("new_message", this.controller.sendMessage);
  };
}

export default ChatRoute;
