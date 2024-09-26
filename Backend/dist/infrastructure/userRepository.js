"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = exports.unblockUserById = exports.blockUserById = exports.findAllUsers = exports.findUserById = exports.updateAdminProfile = exports.findUserByEmailAdmin = exports.updateUserProfile = exports.findUserByEmailAndPassword = exports.updateUser = exports.findUserByEmail = exports.createUser = exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const category_1 = require("../domain/category");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, required: true },
    otp: { type: String },
    otpVerified: { type: Boolean, default: false },
    is_verified: {
        type: Number,
        default: 0,
    },
    isBlocked: { type: Boolean, default: false },
    role: { type: String, default: "user" },
});
exports.UserModel = mongoose_1.default.model("User", UserSchema);
// Function to create a new user and save it to the database.
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new exports.UserModel(user);
    return newUser.save();
});
exports.createUser = createUser;
// Function to find a user by email
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.UserModel.findOne({ email });
});
exports.findUserByEmail = findUserByEmail;
// Function to update a user by email
const updateUser = (email, update) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.UserModel.findOneAndUpdate({ email }, update, { new: true });
});
exports.updateUser = updateUser;
// Function to find a user by email and password
const findUserByEmailAndPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.UserModel.findOne({ email, password });
});
exports.findUserByEmailAndPassword = findUserByEmailAndPassword;
// Function to update the user's profile by user ID
const updateUserProfile = (userId, update) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.UserModel.findByIdAndUpdate(userId, update, { new: true });
});
exports.updateUserProfile = updateUserProfile;
// Function to find a user by their email and password.
const findUserByEmailAdmin = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield exports.UserModel.findOne({ email });
    return user ? user.toObject() : null;
});
exports.findUserByEmailAdmin = findUserByEmailAdmin;
// Function to update the user's profile using their user ID.
const updateAdminProfile = (userId, update) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.UserModel.findByIdAndUpdate(userId, update, { new: true });
});
exports.updateAdminProfile = updateAdminProfile;
// Function to find a user by their email address for admin purposes.
const findUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.UserModel.findById(userId);
});
exports.findUserById = findUserById;
// Fetch all users
const findAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return exports.UserModel.find();
});
exports.findAllUsers = findAllUsers;
// Function to block a user by ID
const blockUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.UserModel.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
});
exports.blockUserById = blockUserById;
// Function to unblock a user by ID
const unblockUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.UserModel.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
});
exports.unblockUserById = unblockUserById;
// Function to fetch all categories from the database.
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return category_1.Category.find();
});
exports.getAllCategories = getAllCategories;
