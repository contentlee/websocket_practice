import BaseController from "./base";
import { clients } from "../socket";
import { Server, Socket } from "socket.io";

class CallContoller extends BaseController {
  constructor(server: Server, socket: Socket) {
    super(server, socket);
  }

  public requireCall = (toUserName: string, fromUserName: string, done: () => void) => {
    const userInfo = clients.findUserIdByName(toUserName);
    if (userInfo) {
      this.socket.join(fromUserName);
      this.socket.to(userInfo.id).emit("require_call", fromUserName);
      done();
    } else {
      this.socket.emit("not_found_user");
    }
  };

  public requireVideoCall = (toUserName: string, fromUserName: string, done: () => void) => {
    const userInfo = clients.findUserIdByName(toUserName);
    if (userInfo) {
      this.socket.join(fromUserName);
      this.socket.to(userInfo.id).emit("require_video_call", fromUserName);
      done();
    } else {
      this.socket.emit("not_found_user");
    }
  };

  public permitCall = (fromUserName: string, done: () => void) => {
    this.socket.join(fromUserName);
    this.socket.to(fromUserName).emit("permit_call");
    done();
  };

  public cancelCall = (fromUserName: string, done: () => void) => {
    this.socket.to(fromUserName).emit("cancel_call");
    done();
  };

  public endCall = (roomName: string, fromUserName: string, done: () => void) => {
    this.socket.leave(fromUserName);
    this.socket.to(roomName).emit("end_call");
    done();
  };
}

export default CallContoller;
