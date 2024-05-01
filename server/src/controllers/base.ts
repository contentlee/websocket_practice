import { Server, Socket } from "socket.io";

class BaseController {
  server;
  socket;

  constructor(server: Server, socket: Socket) {
    this.server = server;
    this.socket = socket;
  }

  protected requireValidation() {
    return this.socket.emit("need_login");
  }

  protected sendError(error: unknown) {
    if (error instanceof Error) this.socket.emit(error.message);
    else console.log(error);
  }
}

export default BaseController;
