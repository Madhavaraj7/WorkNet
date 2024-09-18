import { Server as SocketIOServer, Socket } from "socket.io";

export const onlineUsers = new Map<string, string>();

export const socketHandler = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    socket.on("userOnline", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      io.emit("onlineStatus", Array.from(onlineUsers.keys()));
      console.log("User is online:", userId, "with socket ID:", socket.id);
    });

    socket.on("disconnect", () => {
      onlineUsers.forEach((id, userId) => {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          io.emit("onlineStatus", Array.from(onlineUsers.keys()));
        }
      });
    });
  });
};
