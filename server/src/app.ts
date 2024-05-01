import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import dotenv from "dotenv";

import { SocketEvent } from "./routers";

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
          new SocketEvent(this.wsServer, socket);
        });
      });
    });
  }
}
export default App;
