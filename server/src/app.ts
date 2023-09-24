import http from "http";
import express from "express";
import WebSocket from "ws";

import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets: WebSocket[] = [];

wss.on("connection", (socket: any) => {
  sockets.push(socket);
  socket["nickname"] = "익명";
  socket.on("message", (data: WebSocket.RawData) => {
    const message = JSON.parse(data.toString());
    switch (message.type) {
      case "message":
        sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${message.payload}`));
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
    }
  });

  socket.on("close", () => console.log("Disconnected to Browser"));
});

const handleListen = () => console.log("listein on ws");
server.listen(8080, handleListen);

const io = new Server(3000);

io.on("connection", (socket) => {
  // send a message to the client
  socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });

  // receive a message from the client
  socket.on("hello from client", (...args) => {
    // ...
  });
});
