import { Request, Response } from "express";
import { RoomService } from "../services";
import BaseController from "./base";

class RoomController extends BaseController {
  private service = new RoomService();

  public getRoom = async (req: Request, res: Response) => {
    if (!!!req.headers.cookie) return this.requireValidation();

    try {
      const userName = this.getCookieValue(req.headers.cookie, "user_name");
      const { room, startIdx } = await this.service.getRoom(req.params.room_name, userName);
      res.status(200).json({ room, start_idx: startIdx });
    } catch (err) {
      this.sendError(err);
    }
  };

  public getRooms = async (req: Request, res: Response) => {
    if (!!!req.headers.cookie) return this.requireValidation();
    try {
      const rooms = await this.service.getRooms();
      res.status(200).json({ rooms });
    } catch (err) {
      this.sendError(err);
    }
  };

  // public getRoom = async (roomName: string, userName: string, done: (room: TRoomInfo, startIdx: number) => void) => {
  //   if (!userName) return this.requireValidation();
  //   try {
  //     const { room, startIdx } = await this.service.getRoom(roomName, userName);
  //     done(room, startIdx);
  //   } catch (err) {
  //     this.sendError(err);
  //   }
  // };

  // public getRooms = async (userName: string, done: (list: TRoomsInfo[]) => void) => {
  //   if (!userName) return this.requireValidation();
  //   try {
  //     const rooms = await this.service.getRooms();
  //     done(rooms);
  //   } catch (err) {
  //     this.sendError(err);
  //   }
  // };

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
