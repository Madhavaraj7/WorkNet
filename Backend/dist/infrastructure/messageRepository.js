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
const userRepository_1 = require("./userRepository");
const createMessage = (messageData) => __awaiter(void 0, void 0, void 0, function* () {
    const newMessage = new messagesModel_1.default(messageData);
    return yield newMessage.save();
});
exports.createMessage = createMessage;
const findMessagesByRoomId = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield messagesModel_1.default.find({ roomId }).populate('from to', 'username email');
});
exports.findMessagesByRoomId = findMessagesByRoomId;
const findMessagesByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield messagesModel_1.default.find({
        $or: [{ from: userId }, { to: userId }],
    }).populate('from to', 'username email');
});
exports.findMessagesByUserId = findMessagesByUserId;
const findRoomByRoomId = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield roomsModel_1.default.findOne({ roomId });
});
exports.findRoomByRoomId = findRoomByRoomId;
const createRoom = (roomData) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch sender and receiver names
    const sender = yield userRepository_1.UserModel.findById(roomData.sender);
    const receiver = yield userRepository_1.UserModel.findById(roomData.receiver);
    // Check if both sender and receiver exist
    if (!sender || !receiver) {
        throw new Error('Sender or Receiver not found');
    }
    // Create the new room with names included
    const newRoom = new roomsModel_1.default({
        roomId: roomData.roomId,
        sender: roomData.sender,
        receiver: roomData.receiver,
        senderName: sender.username, // Assuming 'username' is the field for names
        receiverName: receiver.username,
        createdDate: roomData.createdDate || Date.now(), // Use the provided date or default to now
    });
    return yield newRoom.save();
});
exports.createRoom = createRoom;
const updateRoom = (roomId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield roomsModel_1.default.findByIdAndUpdate(roomId, updateData, { new: true });
});
exports.updateRoom = updateRoom;
const findAllRooms = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield roomsModel_1.default.find().sort({ createdDate: -1 });
});
exports.findAllRooms = findAllRooms;
