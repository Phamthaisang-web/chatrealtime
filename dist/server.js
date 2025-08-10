"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const env_helper_1 = require("./helpers/env.helper");
const app_1 = __importDefault(require("./app"));
const socket_io_1 = require("socket.io");
// ✅ Tạo server từ app
const server = http_1.default.createServer(app_1.default);
// ✅ Gắn socket vào server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // hoặc: ["http://127.0.0.1:5500"]
        methods: ["GET", "POST"],
    },
});
// ✅ Socket.IO logic
io.on("connection", (socket) => {
    console.log("🔌 A user connected");
    socket.on("join", (username) => {
        socket.data.username = username;
        console.log(`👤 ${username} joined`);
        socket.broadcast.emit("system", `${username} joined the chat`);
    });
    socket.on("chat message", (msg) => {
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
const PORT = env_helper_1.env.PORT || 3000;
console.log("<<=== 🚀 Starting server ===>>", PORT);
// ✅ Cấu hình kết nối MongoDB
const mongooseDbOptions = {
    autoIndex: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
};
// ✅ Kết nối DB và chạy server
mongoose_1.default
    .connect(env_helper_1.env.MONGODB_URI, mongooseDbOptions)
    .then(() => {
    console.log("✅ Connected to MongoDB");
    // 👉 CHỈ DÙNG server.listen(), KHÔNG DÙNG app.listen()
    server.listen(PORT, () => {
        console.log(`✅ Server is running at http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
});
//# sourceMappingURL=server.js.map