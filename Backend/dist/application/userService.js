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
exports.getUserBookedWorkers = exports.getSlotsByWorkerIdService = exports.fetchAllCategories = exports.resetPassword = exports.forgotPassword = exports.updateUserProfile = exports.refreshAccessToken = exports.loginUser = exports.updateUserOtp = exports.verifyAndSaveUser = exports.googleLogin = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = require("../infrastructure/userRepository");
const userRepository_2 = require("../infrastructure/userRepository");
const sendEmail_1 = require("../utils/sendEmail");
const otpGenerator_1 = require("../utils/otpGenerator");
const slot_1 = require("../domain/slot");
const booking_1 = require("../domain/booking");
// registerUser new User
const registerUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield (0, userRepository_1.findUserByEmail)(user.email);
        if (existingUser) {
            if (existingUser.otpVerified) {
                throw new Error("User already exists");
            }
            else {
                yield (0, userRepository_1.updateUser)(existingUser.email, user);
                return existingUser;
            }
        }
        const hashedPassword = yield bcrypt_1.default.hash(user.password, 10);
        user.password = hashedPassword;
        return yield (0, userRepository_1.createUser)(user);
    }
    catch (error) {
        console.error("Error during user registration:", error);
        throw error;
    }
});
exports.registerUser = registerUser;
// Function to handle Google login
const googleLogin = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, profileImagePath, username, }) {
    try {
        const existingUser = yield (0, userRepository_1.findUserByEmail)(email);
        if (existingUser) {
            const token = jsonwebtoken_1.default.sign({ userId: existingUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
            return { user: existingUser, token };
        }
        else {
            const newUser = {
                username,
                email,
                password: "defaultPassword",
                profileImage: profileImagePath || "",
                otpVerified: true,
                is_verified: 0,
                role: "user",
            };
            const hashedPassword = yield bcrypt_1.default.hash(newUser.password, 10);
            newUser.password = hashedPassword;
            const createdUser = yield (0, userRepository_1.createUser)(newUser);
            const token = jsonwebtoken_1.default.sign({ userId: createdUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
            return { user: createdUser, token };
        }
    }
    catch (error) {
        console.error("Error during Google login:", error);
        throw new Error("Failed to handle Google login");
    }
});
exports.googleLogin = googleLogin;
// Verify OTP and save the user
const verifyAndSaveUser = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userRepository_1.findUserByEmail)(email);
    if (user && user.otp === otp) {
        user.otp = undefined;
        user.otpVerified = true;
        yield user.save();
        return user;
    }
    throw new Error("Invalid OTP");
});
exports.verifyAndSaveUser = verifyAndSaveUser;
// Update user OTP
const updateUserOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userRepository_1.findUserByEmail)(email);
    if (!user) {
        throw new Error("User not found");
    }
    return (0, userRepository_1.updateUser)(email, { otp });
});
exports.updateUserOtp = updateUserOtp;
// login the user
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};
// Refresh the access token using a refresh token
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: "7d" });
};
// Login the user
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userRepository_1.findUserByEmail)(email);
    if (!user) {
        throw new Error("Invalid Email/Password");
    }
    if (user.isBlocked) {
        throw new Error("User is blocked");
    }
    if (!user.otpVerified) {
        throw new Error("OTP verification required");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid Email/Password");
    }
    // Generate JWT access and refresh tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    // Return user and tokens
    return { user, accessToken, refreshToken };
});
exports.loginUser = loginUser;
// Refresh the access token using a refresh token
const refreshAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
        const userId = decoded.userId;
        const user = yield (0, userRepository_1.findUserById)(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const newAccessToken = generateAccessToken(userId);
        return { accessToken: newAccessToken };
    }
    catch (error) {
        throw new Error("Invalid or expired refresh token");
    }
});
exports.refreshAccessToken = refreshAccessToken;
// Update user profile
const updateUserProfile = (userId, update) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield (0, userRepository_2.updateUserProfile)(userId, update);
        if (!updatedUser) {
            throw new Error("User not found");
        }
        return updatedUser;
    }
    catch (error) {
        console.error("Error updating user profile:", error);
        throw new Error("Failed to update user profile");
    }
});
exports.updateUserProfile = updateUserProfile;
// Handle forgot password
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userRepository_1.findUserByEmail)(email);
        if (!user) {
            throw new Error("User not found");
        }
        const otp = (0, otpGenerator_1.otpGenerator)();
        yield (0, userRepository_1.updateUser)(email, { otp });
        yield (0, sendEmail_1.sendEmail)(email, otp, "Your OTP for password reset is:");
        return { message: "OTP sent to your email" };
    }
    catch (error) {
        console.error("Error during password reset request:", error);
        throw new Error("Failed to send OTP");
    }
});
exports.forgotPassword = forgotPassword;
// Function to handle password reset
const resetPassword = (email, otp, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userRepository_1.findUserByEmail)(email);
        if (!user || user.otp !== otp) {
            throw new Error("Invalid OTP or user not found");
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = undefined;
        yield user.save();
        return { message: "Password has been reset successfully" };
    }
    catch (error) {
        console.error("Error during password reset:", error);
        throw new Error("Failed to reset password");
    }
});
exports.resetPassword = resetPassword;
// Fetch all categories
const fetchAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, userRepository_1.getAllCategories)();
});
exports.fetchAllCategories = fetchAllCategories;
// Get available slots by worker ID
const getSlotsByWorkerIdService = (workerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const slots = yield slot_1.Slot.find({
            workerId,
            isAvailable: true,
            date: { $gte: today },
        }).exec();
        return slots;
    }
    catch (error) {
        throw new Error("Error retrieving available slots");
    }
});
exports.getSlotsByWorkerIdService = getSlotsByWorkerIdService;
// Get confirmed bookings for a user
const getUserBookedWorkers = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return booking_1.Booking.find({ userId, status: "Confirmed" })
        .populate({
        path: "workerId",
        select: "name phoneNumber whatsappNumber registerImage",
    })
        .populate({
        path: "slotId",
        select: "date",
    })
        .sort({ createdAt: -1 })
        .exec();
});
exports.getUserBookedWorkers = getUserBookedWorkers;
