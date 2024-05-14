import { UserService } from "../services";
import BaseController from "./base";
import { clients } from "../room";
import { Request, Response } from "express";

class LoginController extends BaseController {
  private service = new UserService();

  public login = async (req: Request, res: Response) => {
    try {
      this.service.login(req.body.userName, this.socket.id);
      res
        .status(200)
        .cookie("user_name", req.body.userName, { httpOnly: true, expires: this._makeExpirationDate(7) })
        .cookie("user_names", req.body.userName, { httpOnly: true, expires: this._makeExpirationDate(7) })
        .json({ message: "success login" });
    } catch (err) {
      this.sendError(err);
    }
  };

  // public login = (userName: string, done: () => void) => {
  //   if (!userName) return this.requireValidation();
  //   this.service.login(userName, this.socket.id);
  //   done();
  // };

  public logout = () => {
    clients.spliceUser(this.socket.id);
  };

  private _makeToday = (val: string | Date | number = new Date().getTime()) => {
    const date = new Date(val);
    const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    return new Date(utc + KR_TIME_DIFF);
  };

  private _makeExpirationDate = (expiration: number) => {
    const today = this._makeToday();
    const expiration_date = new Date(today);
    expiration_date.setDate(today.getDate() + expiration);

    return expiration_date;
  };
}

export default LoginController;
