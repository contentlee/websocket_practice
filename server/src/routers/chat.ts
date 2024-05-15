import { ChatController } from "../controllers";
import BaseRoute from "./base";
import { Server, Socket } from "socket.io";

class ChatRoute extends BaseRoute {
  private controller;
  constructor(server: Server, socket: Socket) {
    super(socket);
    console.log(socket.id, "route");
    this.controller = new ChatController(server, socket);
    this.path = "/rooms/:roomname/chats";

    this.initHttp();
    this.initSocket();
    this.route();
  }

  initHttp = () => {
    this.routes = [["get", "/:idx", [this.controller.getChats]]];
  };

  initSocket = () => {
    this.socket.on("new_message", this.controller.sendMessage);
  };
}

export default ChatRoute;
