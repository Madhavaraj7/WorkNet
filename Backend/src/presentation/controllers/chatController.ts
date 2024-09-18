import { Request, Response } from "express";
import Room from "../../domain/roomsModel";
import Message from "../../domain/messagesModel";
import mongoose, { Types } from "mongoose";
import { io } from "../../app";
import { onlineUsers } from "../socket/chat";

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

    const newMessage = new Message({ roomId, from, to, message });
    await newMessage.save();

    await Room.findByIdAndUpdate(roomId, { latestMessage: newMessage._id });

    const latestMsg = await Message.findById(newMessage._id)
      .populate({ path: "from", select: "_id username profileImage" })
      .populate({ path: "to", select: "_id username profileImage" });

    io.to(roomId).emit("message", latestMsg);

    // Update unread count for the recipient
    const unreadCount = await Message.countDocuments({ to, isRead: false });

    const recipientSocketId = onlineUsers.get(to);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("unreadCount", { unreadCount });
    }

    res.status(201).json(latestMsg);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Error sending message" });
  }
};

// Get rooms list (admin view)
export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await Room.find()
      .populate({
        path: "user",
        select: "_id username profileImage",
      })
      .populate({
        path: "latestMessage", 
        select: "message createdAt",
      })
      .sort({ "latestMessage.createdAt": -1 }); 

    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Error fetching rooms" });
  }
};

// Get messages in a room

export const getMessages = async (req: Request, res: any): Promise<void> => {
  const { roomId } = req.params;
  const admin = "66bb2bd548e166a70bce4c66"; // Admin user ID


  try {
    if (!roomId) {
      return res.status(400).json({ error: "Room ID is required" });
    }

    const messages = await Message.find({ roomId })
      .populate({ path: "from", select: "username profileImage" })
      .populate({ path: "to", select: "username profileImage" });

    await Message.updateMany({ roomId, isRead: false }, { $set: { isRead: true } });

    const unreadCount = await Message.countDocuments({ roomId, isRead: false });

    const recipientSocketId = onlineUsers.get(admin);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("unreadCount", { unreadCount });
      console.log('emitted')
    }
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
};

// Get unread messages count for a specific room or user
export const getUnreadMessagesCount = async (
  req: Request,
  res: any
): Promise<void> => {
  const { userId } = req.params;

  // console.log({userId});

  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const unreadCount = await Message.countDocuments({
      to: userId,
      isRead: false,
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error("Error fetching unread messages count:", error);
    res.status(500).json({ error: "Error fetching unread messages count" });
  }
};
