import { RoomInfo } from "../utils/types";
import WsServer from "./server";

class Service {
  public countMember(roomName: string) {
    return WsServer.server.sockets.adapter.rooms.get(roomName)!.size;
  }

  public checkRoom(roomName: string) {
    return WsServer.server.sockets.adapter.rooms.get(roomName) !== undefined ? true : false;
  }

  public getRooms(): RoomInfo[] {
    const {
      sockets: {
        adapter: { sids, rooms },
      },
    } = WsServer.server;

    const publicRoom: { name: string; length: number; possible: boolean }[] = [];

    rooms.forEach((_, key) => {
      if (sids.get(key) === undefined) {
        const name = key;
        const length = this.countMember(key);
        const possible = true;

        publicRoom.push({ name, length, possible });
      }
    });

    return publicRoom;
  }
}

export default Service;
