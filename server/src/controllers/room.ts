import { RoomService } from "../services";
import { RoomInfo, RoomsInfo } from "../utils/types";
import BaseController from "./base";

class RoomController extends BaseController {
  private service = new RoomService();

  public getRoom = async (roomName: string, userName: string, done: (room: RoomInfo, startIdx: number) => void) => {
    if (!userName) return this.requireValidation();
    try {
      const { room, startIdx } = await this.service.getRoom(roomName, userName);
      done(room, startIdx);
    } catch (err) {
      this.sendError(err);
    }
  };

  public getRooms = async (userName: string, done: (list: RoomsInfo[]) => void) => {
    if (!userName) return this.requireValidation();
    try {
      const rooms = await this.service.getRooms();
      done(rooms);
    } catch (err) {
      this.sendError(err);
    }
  };

  public createRoom = async (userName: string, info: { [index: string]: string }, done: () => void) => {
    if (!userName) return this.requireValidation();

    try {
      await this.service.createRoom(userName, info);
      this.socket.join(info.name);

      const rooms = await this.service.getRooms();
      this.socket.emit("change_rooms", rooms);
      done();
    } catch (err) {
      this.sendError(err);
    }
  };

  public enterRoom = async (roomName: string, userName: string, done: () => void) => {
    if (!userName) return this.requireValidation();

    try {
      await this.service.enterRoom(roomName, userName);
      this.socket.join(roomName);
      this.socket.to(roomName).emit("welcome_room", userName);
      done();
    } catch (err) {
      this.sendError(err);
    }
  };

  public leaveRoom = async (roomName: string, userName: string, done: () => void) => {
    if (!userName) return this.requireValidation();

    try {
      await this.service.leaveRoom(roomName, userName);
      this.socket.leave(roomName);
      this.socket.to(roomName).emit("leave_room", userName);

      done();
    } catch (err) {
      this.sendError(err);
    }
  };
}

export default RoomController;
