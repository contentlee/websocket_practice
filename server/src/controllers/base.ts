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

  protected getCookieValue(cookies: string, key: string) {
    return cookies
      .split(";")
      .filter((cookie) => cookie.split("=")[0].trim() === key)[0]
      .split("=")[1];
  }
}

export default BaseController;
