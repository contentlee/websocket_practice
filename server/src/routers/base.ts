import { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { Server, Socket } from "socket.io";

export type TRoute = [
  "get" | "post" | "patch" | "delete",
  string,
  ((req: Request, res: Response, next: NextFunction) => Promise<any> | void)[]
];

class BaseRoute {
  public router = Router();
  protected routes: TRoute[] = [];
  protected path = "";

  protected socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  private _initializeRoutes([method, url, ...controller]: TRoute) {
    this.router[method](this.path + url, ...controller);
  }

  protected route() {
    this.routes.forEach((route) => {
      this._initializeRoutes(route);
    });
  }
}

export default BaseRoute;
