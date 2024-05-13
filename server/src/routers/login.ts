import { Server, Socket } from "socket.io";
import BaseRoute from "./base";
import { LoginController } from "../controllers";

class LoginRoute extends BaseRoute {
  private controller;

  constructor(server: Server, socket: Socket) {
    super(socket);
    this.controller = new LoginController(server, socket);

    this.initSocket();
  }

  // initHttp = () => {
  //   this.routes = [["post", "/login", [this.controller.login]]];
  // };

  initSocket = () => {
    this.socket.on("login", this.controller.login);
    this.socket.on("disconnect", this.controller.logout);
  };
}

export default LoginRoute;
