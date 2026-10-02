const { Server } = require("socket.io");

let io;

const initSocket = (server, allowedOrigins) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      socket.join(userId);
    });
  });

  return io;
};

const getIo = () => {
  return io;
};

module.exports = { initSocket, getIo };
