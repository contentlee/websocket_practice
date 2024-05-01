import BaseController from "./base";
import client from "../utils/context";

class RTCController extends BaseController {
  public offer = (roomName: string, offer: RTCSessionDescriptionInit, done: () => void) => {
    this.socket.to(roomName).emit("offer", offer);
    done();
  };

  public answer = (fromName: string, answer: RTCSessionDescriptionInit, done: () => void) => {
    const userInfo = client.findUserIdByName(fromName);
    if (userInfo) {
      this.socket.to(userInfo.id).emit("answer", answer);
      done();
    } else {
      this.socket.emit("exit_from_user");
    }
  };

  public icecandidate = (roomName: string, ice: RTCPeerConnectionIceEvent) => {
    this.socket.to(roomName).emit("icecandidate", ice);
  };
}

export default RTCController;
