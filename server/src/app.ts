import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const httpServer = http.createServer(app);

const wsServer = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const countMember = (roomName: string) => {
  return wsServer.sockets.adapter.rooms.get(roomName)!.size;
};

const getRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRoom: { name: string; length: number }[] = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRoom.push({ name: key, length: countMember(key) });
    }
  });

  return publicRoom;
};

wsServer.on("connection", (socket) => {
  socket.on("create_room", (name, done) => {
    socket.join(name);
    wsServer.sockets.emit("change_rooms", getRooms());
    done();
  });

  socket.on("enter_room", (name, room, done) => {
    socket.join(name);
    socket.to(room).emit("welcome", name);
    done();
  });

  socket.on("new_message", (message, room, name, done) => {
    socket.to(room).emit("new_message", name, message);
    done();
  });
});

const handleListen = () => console.log("listen on ws");
httpServer.listen(8080, handleListen);
