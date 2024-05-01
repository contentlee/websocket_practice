import clients from "../utils/context";

class UserService {
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
