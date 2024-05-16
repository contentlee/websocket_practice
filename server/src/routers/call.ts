import { Server, Socket } from "socket.io";
import BaseRoute from "./base";
import { CallContoller } from "../controllers";

class CallRoute extends BaseRoute {
  private controller;
  constructor(server: Server, socket: Socket) {
    super(socket);
    this.controller = new CallContoller(server, socket);
    this.initSocket();
  }

  initSocket = () => {
    this.socket.on("require_call", this.controller.requireCall);
    this.socket.on("require_video_call", this.controller.requireVideoCall);
    this.socket.on("permit_call", this.controller.permitCall);
    this.socket.on("cancel_call", this.controller.cancelCall);
    this.socket.on("reject_call", this.controller.rejectCall);
    this.socket.on("end_call", this.controller.endCall);
  };
}

export default CallRoute;
