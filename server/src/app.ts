import { Server, Socket } from "socket.io";
import { createServer } from "http";
import express from "express";
import dotenv from "dotenv";

import { CallRoute, ChatRoute, LoginRoute, RTCRoute, RoomRoute } from "./routers";

import Database from "./libs/database";

class App {
  private wsServer: Server = new Server();
  private app = express();
  private httpServer = createServer(this.app);

  constructor() {
    this._initUtils();
    this._initHeaders();
    this._initMiddlewares();
    this._initSocketServer();
  }

  private _initUtils() {
    dotenv.config();
    this.app.use(express.urlencoded({ extended: true }));
  }

  private _initMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private _initRoute(socket: Socket) {
    const routes = [CallRoute, ChatRoute, LoginRoute, RoomRoute, RTCRoute];

    routes.forEach((Route) => {
      const route = new Route(this.wsServer, socket);
      this.app.use(route.router);
    });
  }

  private _initHeaders() {
    this.app.use((_, res, next) => {
      res.header("Access-Control-Allow-Origin", process.env.ORIGIN_SUB_DOMAIN);
      res.header("Access-Control-Allow-Methods", "GET, POST");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

      next();
    });
  }

  private _initSocketServer() {
    this.wsServer.attach(this.httpServer, {
      cors: {
        origin: ["http://192.168.0.122:5173", "http://localhost:5173", "http://localhost:8080"],
        methods: ["GET", "POST"],
      },
    });
  }

  listen() {
    this.httpServer.listen(8080, () => {
      Database.connect(() => {
        this.wsServer.on("connection", (socket) => {
          console.log("listen on ws");
          this._initRoute(socket);
        });
      });
    });
  }
}
export default App;
