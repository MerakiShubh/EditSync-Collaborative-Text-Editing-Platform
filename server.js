// require("dotenv").config({ path: "./env" });
const { Socket } = require("engine.io-client");
const express = require("express");
const app = express();
const http = require("http");
// const cors = require("cors");
const { Server } = require("socket.io");
// const { ACTIONS } = require("./src/pages/Actions.jsx");

const server = http.createServer(app);

const io = new Server(server);

const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap.socketId,
      };
    }
  );
}

// app.use(cors());

io.on("connection", (socket) => {
  console.log("Socket is connected", socket.id);

  // Listening join event from edtiorpage

  socket.on("join", ({ roomId, username }) => {
    // console.log(`socketId from roomID ${roomId}`);
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
      delete userSocketMap[socket.id];
      socket.leave();
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
