import { UserService } from "../services";
import BaseController from "./base";
import Clients from "../utils/context";

class LoginController extends BaseController {
  private service = new UserService();

  public login = (userName: string, done: () => void) => {
    if (!userName) return this.requireValidation();
    this.service.login(userName, this.socket.id);
    done();
  };

  public logout = () => {
    Clients.spliceUser(this.socket.id);
  };
}

export default LoginController;
