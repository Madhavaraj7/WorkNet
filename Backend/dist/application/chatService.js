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
exports.findAllRooms = exports.updateRoom = exports.createRoom = exports.findRoomByRoomId = exports.findMessagesByUserId = exports.findMessagesByRoomId = exports.createMessage = void 0;
const messagesModel_1 = __importDefault(require("../domain/messagesModel"));
const roomsModel_1 = __importDefault(require("../domain/roomsModel"));
const userRepository_1 = require("../infrastructure/userRepository");
// Create a new message and save it to the database
const createMessage = (messageData) => __awaiter(void 0, void 0, void 0, function* () {
    const newMessage = new messagesModel_1.default(messageData);
    return yield newMessage.save();
});
exports.createMessage = createMessage;
// Retrieve messages associated with a specific room ID
const findMessagesByRoomId = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield messagesModel_1.default.find({ roomId }).populate('from to', 'username');
});
exports.findMessagesByRoomId = findMessagesByRoomId;
// Find messages sent or received by a specific user ID
const findMessagesByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield messagesModel_1.default.find({
        $or: [{ from: userId }, { to: userId }],
    }).populate('from to', 'username');
});
exports.findMessagesByUserId = findMessagesByUserId;
// Find a room by its unique room ID
const findRoomByRoomId = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield roomsModel_1.default.findOne({ roomId });
});
exports.findRoomByRoomId = findRoomByRoomId;
// Create a new room between a sender and a receiver
const createRoom = (roomData) => __awaiter(void 0, void 0, void 0, function* () {
    const sender = yield userRepository_1.UserModel.findById(roomData.sender);
    const receiver = yield userRepository_1.UserModel.findById(roomData.receiver);
    if (!sender || !receiver) {
        throw new Error('Sender or Receiver not found');
    }
    const newRoom = new roomsModel_1.default({
        roomId: roomData.roomId,
        sender: roomData.sender,
        receiver: roomData.receiver,
        senderName: sender.username,
        receiverName: receiver.username,
        createdDate: roomData.createdDate || Date.now(),
    });
    return yield newRoom.save();
});
exports.createRoom = createRoom;
// Update the details of an existing room
const updateRoom = (roomId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield roomsModel_1.default.findByIdAndUpdate(roomId, updateData, { new: true });
});
exports.updateRoom = updateRoom;
// Retrieve all rooms sorted by creation date in descending order
const findAllRooms = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield roomsModel_1.default.find().sort({ createdDate: -1 });
});
exports.findAllRooms = findAllRooms;
