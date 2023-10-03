import http from "http";
import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";

import Database from "./libs/database";
import { SocketEvent } from "./routers";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const wsServer = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

httpServer.listen(8080, () => {
  console.log("listen on ws");
  Database.connect(() => {
    wsServer.on("connection", (socket) => {
      new SocketEvent(wsServer, socket);
    });
  });
});
