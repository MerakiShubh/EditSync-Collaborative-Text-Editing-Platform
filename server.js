// require("dotenv").config({ path: "./env" });
const { Socket } = require("engine.io-client");
const express = require("express");
const app = express();
const http = require("http");
// const cors = require("cors");
const { Server } = require("socket.io");
const ACTIONS = require("./src/pages/Actions.jsx");

const server = http.createServer(app);

const io = new Server(server);

// app.use(cors());

io.on("connection", (socket) => {
  console.log("Socket is connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
