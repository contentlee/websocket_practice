import { Server, Socket } from "socket.io";
import BaseRoute from "./base";
import { LoginController } from "../controllers";

class LoginRoute extends BaseRoute {
  private controller;

  constructor(server: Server, socket: Socket) {
    super(socket);
    this.controller = new LoginController(server, socket);
    this.path = "/login";

    this.initHttp();
    this.initSocket();
    this.route();
  }

  initHttp = () => {
    this.routes = [["post", "", [this.controller.login]]];
  };

  initSocket = () => {
    this.socket.on("disconnect", this.controller.logout);
  };
}

export default LoginRoute;
