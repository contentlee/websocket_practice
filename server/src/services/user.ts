import { RoomModel } from "../models";
import { Room } from "../room";
import { clients } from "../socket";

class UserService {
  roomModel = new RoomModel();

  public login(user: string, id: string) {
    const index = clients.findUserIdxByName(user);
    if (index > -1) this._refresh(index, id);
    else clients.pushUser(user, id);
  }

  private _refresh(index: number, id: string) {
    clients.addUserId(index, id);
  }
}

export default UserService;
