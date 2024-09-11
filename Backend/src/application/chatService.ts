import Message from '../domain/messagesModel';
import Room from '../domain/roomsModel';
import { UserModel } from '../infrastructure/userRepository';

export const createMessage = async (messageData: any) => {
  const newMessage = new Message(messageData);
  return await newMessage.save();
};

export const findMessagesByRoomId = async (roomId: string) => {
  return await Message.find({ roomId }).populate('from to', 'username');
};

export const findMessagesByUserId = async (userId: string) => {
  return await Message.find({
    $or: [{ from: userId }, { to: userId }],
  }).populate('from to', 'username');
};

export const findRoomByRoomId = async (roomId: string) => {
  return await Room.findOne({ roomId });
};

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

export const updateRoom = async (roomId: string, updateData: any) => {
  return await Room.findByIdAndUpdate(roomId, updateData, { new: true });
};

export const findAllRooms = async () => {
  return await Room.find().sort({ createdDate: -1 });
};