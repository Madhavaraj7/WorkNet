import { Server as SocketIOServer, Socket } from 'socket.io';

export const socketHandler = (io: SocketIOServer) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
  
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
