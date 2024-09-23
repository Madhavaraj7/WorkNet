"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadMessagesCount = exports.getMessages = exports.getRooms = exports.sendMessage = exports.createRoom = void 0;
const roomsModel_1 = __importDefault(require("../../domain/roomsModel"));
const messagesModel_1 = __importDefault(require("../../domain/messagesModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("../../app");
const chat_1 = require("../socket/chat");
// Create or find a room
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        // Validate IDs
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        let room = yield roomsModel_1.default.findOne({ user: userId });
        if (!room) {
            room = new roomsModel_1.default({ user: new mongoose_1.default.Types.ObjectId(userId) });
            yield room.save();
        }
        res.status(201).json({ roomId: room._id });
    }
    catch (error) {
        console.error("Error creating or finding room:", error);
        res.status(500).json({ error: "Error creating or finding room" });
    }
});
exports.createRoom = createRoom;
// Send a message
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, from, to, message } = req.body;
    try {
        if (!roomId || !from || !to || !message) {
            return res.status(400).json({ error: "Room ID, From, To, and Message are required" });
        }
        const newMessage = new messagesModel_1.default({ roomId, from, to, message });
        yield newMessage.save();
        yield roomsModel_1.default.findByIdAndUpdate(roomId, { latestMessage: newMessage._id });
        const latestMsg = yield messagesModel_1.default.findById(newMessage._id)
            .populate({ path: "from", select: "_id username profileImage" })
            .populate({ path: "to", select: "_id username profileImage" });
        app_1.io.to(roomId).emit("message", latestMsg);
        // Update unread count for the recipient
        const unreadCount = yield messagesModel_1.default.countDocuments({ to, isRead: false });
        const recipientSocketId = chat_1.onlineUsers.get(to);
        if (recipientSocketId) {
            app_1.io.to(recipientSocketId).emit("unreadCount", { unreadCount });
        }
        res.status(201).json(latestMsg);
    }
    catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Error sending message" });
    }
});
exports.sendMessage = sendMessage;
// Get rooms list (admin view)
const getRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield roomsModel_1.default.find()
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
    }
    catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: "Error fetching rooms" });
    }
});
exports.getRooms = getRooms;
// Get messages in a room
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    const admin = "66bb2bd548e166a70bce4c66"; // Admin user ID
    try {
        if (!roomId) {
            return res.status(400).json({ error: "Room ID is required" });
        }
        const messages = yield messagesModel_1.default.find({ roomId })
            .populate({ path: "from", select: "username profileImage" })
            .populate({ path: "to", select: "username profileImage" });
        yield messagesModel_1.default.updateMany({ roomId, isRead: false }, { $set: { isRead: true } });
        const unreadCount = yield messagesModel_1.default.countDocuments({ roomId, isRead: false });
        const recipientSocketId = chat_1.onlineUsers.get(admin);
        if (recipientSocketId) {
            app_1.io.to(recipientSocketId).emit("unreadCount", { unreadCount });
            console.log('emitted');
        }
        res.status(200).json(messages);
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Error fetching messages" });
    }
});
exports.getMessages = getMessages;
// Get unread messages count for a specific room or user
const getUnreadMessagesCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    // console.log({userId});
    try {
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const unreadCount = yield messagesModel_1.default.countDocuments({
            to: userId,
            isRead: false,
        });
        res.status(200).json({ unreadCount });
    }
    catch (error) {
        console.error("Error fetching unread messages count:", error);
        res.status(500).json({ error: "Error fetching unread messages count" });
    }
});
exports.getUnreadMessagesCount = getUnreadMessagesCount;
