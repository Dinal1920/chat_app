import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const userSocketMap = {}; 

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], 
    credentials: true, // 
  },
});
// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("User map:", userSocketMap);
  }

  //  send online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  //  delete message event
  socket.on("deleteMessage", ({ messageId, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", messageId);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

export { getReceiverSocketId, io, server, app };