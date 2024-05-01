import clients from "../utils/context";

class UserService {
  public login(user: string, id: string) {
    if (clients.findUserIdByName(user)) this._refresh(id);
    else clients.pushUser(user, id);
  }

  private _refresh(id: string) {
    const index = clients.findUserIdxById(id);
    clients.changeUserId(index, id);
  }
}

export default UserService;
