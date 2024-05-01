import BaseController from "./base";
import Clients from "../utils/context";

class CallContoller extends BaseController {
  public requireCall = (toUserName: string, fromUserName: string, done: () => void) => {
    const userInfo = Clients.findUserIdByName(toUserName);
    if (userInfo) {
      this.socket.join(fromUserName);
      this.socket.to(userInfo.id).emit("require_call", fromUserName);
      done();
    } else {
      this.socket.emit("not_found_user");
    }
  };

  public requireVideoCall = (toUserName: string, fromUserName: string, done: () => void) => {
    const userInfo = Clients.findUserIdByName(toUserName);
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

  public endCall = (fromUserName: string, done: () => void) => {
    this.socket.leave(fromUserName);
    this.socket.to(fromUserName).emit("end_call");
    done();
  };
}

export default CallContoller;
