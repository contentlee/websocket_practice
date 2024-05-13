import { Server, Socket } from "socket.io";
import { createServer } from "http";
import express from "express";
import dotenv from "dotenv";

import { ChatRoute, LoginRoute, RTCRoute, RoomRoute } from "./routers";

import Database from "./libs/database";

class App {
  private wsServer: Server = new Server();
  private app = express();
  private httpServer = createServer(this.app);

  constructor() {
    this.initUtils();
    this.initServer();
  }

  initUtils() {
    dotenv.config();
  }

  initRoute(socket: Socket) {
    const routes = [ChatRoute, LoginRoute, RoomRoute, RTCRoute];

    routes.forEach((Route) => {
      const route = new Route(this.wsServer, socket);
      if (route.router.stack.length) this.app.use(route.router);
    });
  }

  initServer() {
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
          this.initRoute(socket);
        });
      });
    });
  }
}
export default App;
