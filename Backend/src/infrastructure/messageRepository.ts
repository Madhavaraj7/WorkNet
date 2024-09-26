import Message from '../domain/messagesModel';
import Room from '../domain/roomsModel';
import { UserModel } from './userRepository';


// Create a new message and save it to the database.
export const createMessage = async (messageData: any) => {
  const newMessage = new Message(messageData);
  return await newMessage.save();
};

// Find messages in a specific room by its ID.
export const findMessagesByRoomId = async (roomId: string) => {
  return await Message.find({ roomId }).populate('from to', 'username email');
};

// Find messages sent by or to a specific user by their ID.
export const findMessagesByUserId = async (userId: string) => {
  return await Message.find({
    $or: [{ from: userId }, { to: userId }],
  }).populate('from to', 'username email');
};

// Find a chat room by its room ID.
export const findRoomByRoomId = async (roomId: string) => {
  return await Room.findOne({ roomId });
};


// Create a new chat room and save it to the database, including sender and receiver names.
export const createRoom = async (roomData: any) => {
  const sender = await UserModel.findById(roomData.sender);
  const receiver = await UserModel.findById(roomData.receiver);

  if (!sender || !receiver) {
    throw new Error('Sender or Receiver not found');
  }

  const newRoom = new Room({
    roomId: roomData.roomId,
    sender: roomData.sender,
    receiver: roomData.receiver,
    senderName: sender.username,  
    receiverName: receiver.username,
    createdDate: roomData.createdDate || Date.now(),  
  });

  return await newRoom.save();
};


// Update an existing room by its ID with new data.
export const updateRoom = async (roomId: string, updateData: any) => {
  return await Room.findByIdAndUpdate(roomId, updateData, { new: true });
};


// Retrieve all chat rooms sorted by creation date in descending order.
export const findAllRooms = async () => {
  return await Room.find().sort({ createdDate: -1 });
};
