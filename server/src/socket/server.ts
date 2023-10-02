import { Server, Socket } from "socket.io";

class WsServer {
  static server: Server;
  static socket: Socket;

  constructor(server: Server, socket: Socket) {
    WsServer.server = server;
    WsServer.socket = socket;
  }
}

export default WsServer;
