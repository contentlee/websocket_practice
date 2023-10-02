import http from "http";
import express from "express";
import { Server, Socket } from "socket.io";
import Events from "./socket/events";
import WsServer from "./socket/server";

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

  wsServer.on("connection", (socket) => {
    new WsServer(wsServer, socket);
    new Events();
  });
});
