import mongoose from "mongoose";
import http from "http";
import { env } from "./helpers/env.helper";
import app from "./app";
import { Server } from "socket.io";

// ✅ Tạo server từ app
const server = http.createServer(app);

// ✅ Gắn socket vào server
const io = new Server(server, {
  cors: {
    origin: "*", // hoặc: ["http://127.0.0.1:5500"]
    methods: ["GET", "POST"],
  },
});

// ✅ Socket.IO logic
io.on("connection", (socket) => {
  console.log("🔌 A user connected");

  socket.on("join", (username: string) => {
    socket.data.username = username;
    console.log(`👤 ${username} joined`);
    socket.broadcast.emit("system", `${username} joined the chat`);
  });

  socket.on("chat message", (msg: string) => {
    io.emit("chat message", {
      user: socket.data.username || "unknown",
      text: msg,
    });
  });

  socket.on("disconnect", () => {
    const user = socket.data.username || "Someone";
    console.log(`❌ ${user} disconnected`);
    io.emit("system", `${user} left the chat`);
  });
});

const PORT = env.PORT || 3000;
console.log("<<=== 🚀 Starting server ===>>", PORT);

// ✅ Cấu hình kết nối MongoDB
const mongooseDbOptions = {
  autoIndex: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};
server.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
// ✅ Kết nối DB và chạy server
