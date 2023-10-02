import WsServer from "./server";

class Middleware {
  public checkUserName() {
    return WsServer.socket.data.userName ? true : false;
  }
  public requireValidation() {
    return WsServer.socket.emit("need_login");
  }
}

export default Middleware;
