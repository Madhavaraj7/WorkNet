import { Request, Response } from "express";
import Room from "../../domain/roomsModel";
import Message from "../../domain/messagesModel";
import mongoose, { Types } from "mongoose";
import { io } from '../../app'; // Ensure you have an instance of Socket.io server running




// Create or find a room
export const createRoom = async (req: Request, res: any): Promise<void> => {
  const { userId }: { userId: string } = req.body;

  try {
    // Validate IDs
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    let room = await Room.findOne({ user: userId });

    if (!room) {
      room = new Room({ user: new mongoose.Types.ObjectId(userId) });
      await room.save();
    }

    res.status(201).json({ roomId: room._id });
  } catch (error) {
    console.error("Error creating or finding room:", error);
    res.status(500).json({ error: "Error creating or finding room" });
  }
};

// Send a message
export const sendMessage = async (req: Request, res: any): Promise<void> => {
  const { roomId, from, to, message } = req.body;

  try {
    if (!roomId || !from || !to || !message) {
      return res.status(400).json({ error: "Room ID, From, To, and Message are required" });
    }

    // Save new message to database
    const newMessage = new Message({ roomId, from, to, message });
    await newMessage.save();

    // Find the saved message with populated user fields
    const latestMsg = await Message.findById(newMessage._id)
      .populate({ path: 'from', select: '_id username profileImage' })
      .populate({ path: 'to', select: '_id username profileImage' });

    // Emit the new message to the specific room using Socket.io
    io.to(roomId).emit('message', latestMsg);

    // Respond with the saved message
    res.status(201).json(latestMsg);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Error sending message" });
  }
};

// Get rooms list (admin view)
export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await Room.find().populate({
      path: "user",
      select: "_id username profileImage",
    });

    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Error fetching rooms" });
  }
};

// Get messages in a room
export const getMessages = async (req: Request, res: any): Promise<void> => {
  const { roomId } = req.params;

  try {
    if (!roomId) {
      return res.status(400).json({ error: "Room ID is required" });
    }

    const messages = await Message.find({ roomId })
      .populate({
        path: "from",
        select: "username profileImage",
      })
      .populate({
        path: "to",
        select: "username profileImage",
      });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
};
