// src/presentation/socket/socketHandler.ts

import { Server as SocketIOServer, Socket } from 'socket.io';

// Handle Socket.IO connections and events
export const socketHandler = (io: SocketIOServer) => {
  io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);

    // Handle message sending
    socket.on('sendMessage', (messageData) => {
      console.log('Message received:', messageData);
      io.emit('message', messageData); 
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
