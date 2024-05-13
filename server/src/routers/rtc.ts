import { Server, Socket } from "socket.io";
import BaseRoute from "./base";
import { RTCController } from "../controllers";

class RTCRoute extends BaseRoute {
  private controller;
  constructor(server: Server, socket: Socket) {
    super(socket);
    this.controller = new RTCController(server, socket);

    this.initSocket();
  }

  initSocket = () => {
    this.socket.on("offer", this.controller.offer);
    this.socket.on("answer", this.controller.answer);
    this.socket.on("icecandidate", this.controller.icecandidate);
  };
}

export default RTCRoute;
