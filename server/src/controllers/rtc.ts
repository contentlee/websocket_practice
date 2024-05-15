import BaseController from "./base";
import { clients } from "../socket";
import { Server, Socket } from "socket.io";

class RTCController extends BaseController {
  constructor(server: Server, socket: Socket) {
    super(server, socket);
  }

  public offer = (roomName: string, offer: RTCSessionDescriptionInit, done: () => void) => {
    this.socket.to(roomName).emit("offer", offer);
    done();
  };

  public answer = (fromName: string, answer: RTCSessionDescriptionInit, done: () => void) => {
    const userInfo = clients.findUserIdByName(fromName);
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
