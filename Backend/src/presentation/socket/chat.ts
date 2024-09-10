import { Socket } from 'socket.io';
import Room from '../../domain/roomsModel'; // Corrected path
import Message from '../../domain/messagesModel'; // Corrected path
import { UserModel } from '../../infrastructure/userRepository';

interface NewMessage {
  roomId?: string; // Optional property
  from: string;
  to: string;
  message: string;
  time: string; 
}

// Admin and user socket storage
let adminSocket: Socket | null = null;
const userSockets: Record<string, Socket> = {};

// Handle socket connections
export const socketHandler = (socket: Socket) => {
  // Handle user messages
  socket.on('userMessage', async (newMessage: NewMessage) => {
    const { from, to, message, time } = newMessage;

    console.log(newMessage);
    

    try {
      const existingRoom = await Room.findOne({ roomId: from });
      console.log("he",existingRoom);
      
      let roomId;

      if (existingRoom) {
        socket.join(from);
        roomId = existingRoom._id;
      } else {
        const newRoom = new Room({ roomId: from, createdDate: new Date() });
        await newRoom.save();
        socket.join(from);
        roomId = newRoom._id;
      }

      const latestMessage = new Message({ roomId, from, to, message, time });
      await latestMessage.save();

      await Room.findByIdAndUpdate(roomId, { createdDate: latestMessage.createdAt }, { new: true });

      const allRooms = await Room.find().sort({ createdDate: -1 });

      if (adminSocket) {
        adminSocket.emit('adminRooms', allRooms);
      }
    } catch (error) {
      console.error('Error handling user message:', error);
    }
  });

  // Handle admin room opening
  socket.on('adminRoomOpen', async () => {
    try {
      const allRooms = await Room.find().sort({ createdDate: -1 });

      // Fetch user details (sender's name and profile image)
      const roomDetails = await Promise.all(
        allRooms.map(async (room) => {
          const user = await UserModel.findOne({ _id: room.roomId }); // Assuming `roomId` is the user's ID
          return {
            ...room.toObject(),
            senderName: user?.username || 'Unknown User',
            profileImage: user?.profileImage || '', // Add profile image
          };
        })
      );

      socket.emit('adminRooms', roomDetails); // Emit the room details with user data
    } catch (error) {
      console.error('Error handling admin room open:', error);
    }
  });

  // Handle admin side room messages
  socket.on('adminSideRoom', async (roomId: string) => {
    try {
      // Find all messages for the given roomId
      const allMessages = await Message.find({ roomId });
  
      // Fetch user details for each message
      const messagesWithUserDetails = await Promise.all(
        allMessages.map(async (message) => {
          // Assuming each message has a senderId field to reference the user
          const user = await UserModel.findOne({ _id: message.from });
          return {
            ...message.toObject(),
            senderName: user?.username || 'Unknown User',
            profileImage: user?.profileImage || '', // Add profile image
          };
        })
      );
  
      // Emit the messages with user details
      socket.emit('adminMessage', messagesWithUserDetails);
    } catch (error) {
      console.error('Error handling admin side room update:', error);
    }
  });
  

  // Handle user side room messages
  socket.on('userSideRoom', async (userId: string) => {
    try {
      const allMessages = await Message.find({ $or: [{ to: userId }, { from: userId }] });
      socket.emit('userMessage', allMessages);
    } catch (error) {
      console.error('Error handling user side room update:', error);
    }
  });

  // Handle admin messages
  socket.on('adminMessage', async (newMessage: NewMessage) => {
    const { roomId, from, to, message, time } = newMessage;

    console.log("ad",{roomId});
    

    try {
      socket.join(from);
      const latestMessage = new Message({ roomId, from, to, message, time });
      await latestMessage.save();

      const allMessages = await Message.find({ roomId });
      console.log(allMessages);
      
      socket.to(to).emit('adminMessage', allMessages);
    } catch (error) {
      console.error('Error handling admin message:', error);
    }
  });

  // Handle admin connection
  socket.on('adminConnected', (admin: string) => {
    adminSocket = socket;
    socket.join(admin);
  });

  // Handle user connection
  socket.on('userConnected', (userId: string) => {
    userSockets[userId] = socket;
    socket.join(userId);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const userId = Object.keys(userSockets).find((key) => userSockets[key] === socket);
    if (userId) {
      delete userSockets[userId];
    } else if (adminSocket === socket) {
      adminSocket = null;
    }
  });
};
