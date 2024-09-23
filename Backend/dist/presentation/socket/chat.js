"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandler = exports.onlineUsers = void 0;
exports.onlineUsers = new Map();
const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            console.log(`User joined room: ${roomId}`);
        });
        socket.on("userOnline", (userId) => {
            exports.onlineUsers.set(userId, socket.id);
            io.emit("onlineStatus", Array.from(exports.onlineUsers.keys()));
            console.log("User is online:", userId, "with socket ID:", socket.id);
        });
        socket.on("disconnect", () => {
            exports.onlineUsers.forEach((id, userId) => {
                if (id === socket.id) {
                    exports.onlineUsers.delete(userId);
                    io.emit("onlineStatus", Array.from(exports.onlineUsers.keys()));
                }
            });
        });
    });
};
exports.socketHandler = socketHandler;
