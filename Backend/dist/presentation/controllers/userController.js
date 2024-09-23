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
exports.getUserBookedWorkersController = exports.getSlotsByWorkerIdController = exports.getCategoriesController = exports.resetPasswordHandler = exports.forgotPasswordHandler = exports.updateProfile = exports.login = exports.resendOtp = exports.verifyOtp = exports.register = exports.googleLoginHandler = void 0;
const userService_1 = require("../../application/userService");
const otpGenerator_1 = require("../../utils/otpGenerator");
const sendEmail_1 = require("../../utils/sendEmail");
const userRepository_1 = require("../../infrastructure/userRepository");
const wallet_1 = require("../../domain/wallet"); // Adjust the path if needed
const axios_1 = __importDefault(require("axios"));
const sharp_1 = __importDefault(require("sharp"));
const cloudinaryConfig_1 = __importDefault(require("../../cloudinaryConfig"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Handle Google login
const googleLoginHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, profileImage } = req.body;
        if (!profileImage) {
            return res.status(400).json({ error: 'Profile image URL is required' });
        }
        const imageResponse = yield (0, axios_1.default)({
            url: profileImage,
            responseType: 'arraybuffer',
        });
        const imageBuffer = yield (0, sharp_1.default)(imageResponse.data)
            .jpeg()
            .toBuffer();
        cloudinaryConfig_1.default.uploader.upload_stream((error, result) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
            }
            const profileImageUrl = (result === null || result === void 0 ? void 0 : result.secure_url) || '';
            (0, userService_1.googleLogin)({
                email,
                username,
                profileImagePath: profileImageUrl,
            }).then((loginResult) => {
                res.status(200).json(loginResult);
            }).catch(error => {
                res.status(500).json({ error: 'Failed to handle Google login' });
            });
        }).end(imageBuffer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process Google login' });
    }
});
exports.googleLoginHandler = googleLoginHandler;
// Register the user
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const profileImage = req.file ? req.file.buffer : req.body.profileImage;
        let profileImageUrl = '';
        const proceedWithRegistration = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const otp = (0, otpGenerator_1.otpGenerator)();
                yield (0, userService_1.registerUser)({
                    username,
                    email,
                    password,
                    profileImage: profileImageUrl,
                    otp,
                    is_verified: 0,
                    isBlocked: false,
                    role: "user",
                });
                yield (0, sendEmail_1.sendEmail)(email, otp);
                res.status(200).json("OTP sent to email");
            }
            catch (error) {
                res.status(400).json({ error: 'Registration failed: ' + error.message });
            }
        });
        if (profileImage) {
            cloudinaryConfig_1.default.uploader.upload_stream((error, result) => {
                if (error) {
                    return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
                }
                profileImageUrl = (result === null || result === void 0 ? void 0 : result.secure_url) || '';
                proceedWithRegistration();
            }).end(profileImage);
        }
        else {
            profileImageUrl = req.body.profileImage || '';
            proceedWithRegistration();
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.register = register;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const user = yield (0, userRepository_1.findUserByEmail)(email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.otp === otp) {
            // Verify the user
            yield (0, userService_1.verifyAndSaveUser)(email, otp);
            const newWallet = new wallet_1.WalletModel({
                userId: user._id,
                walletBalance: 0,
                walletTransaction: [], // Empty transactions array for now
            });
            // Save the wallet to the database
            yield newWallet.save();
            // Respond with success
            res.status(200).json("User registered and wallet created successfully");
        }
        else {
            res.status(400).json({ error: "Invalid OTP" });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.verifyOtp = verifyOtp;
const resendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    try {
        const user = yield (0, userRepository_1.findUserByEmail)(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const otp = (0, otpGenerator_1.otpGenerator)();
        yield (0, userService_1.updateUserOtp)(email, otp);
        yield (0, sendEmail_1.sendEmail)(email, otp);
        res.status(200).json({ message: 'OTP has been resent' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to resend OTP' });
    }
});
exports.resendOtp = resendOtp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = yield (0, userService_1.loginUser)(email, password);
        // console.log({ user, accessToken, refreshToken });
        res.status(200).json({ user, accessToken, refreshToken });
    }
    catch (error) {
        // Handle login errors
        res.status(400).json({ error: error.message });
    }
});
exports.login = login;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        const { username, email, oldPassword, newPassword } = req.body;
        const profileImage = req.file ? req.file.buffer : null;
        let profileImageUrl = '';
        const user = yield (0, userRepository_1.findUserById)(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const proceedWithUpdate = (hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const updateData = {
                    username,
                    email,
                    profileImage: profileImageUrl || undefined,
                };
                if (hashedPassword) {
                    updateData.password = hashedPassword;
                }
                const updatedUser = yield (0, userService_1.updateUserProfile)(userId, updateData);
                res.status(200).json(updatedUser);
            }
            catch (error) {
                res.status(400).json({ error: 'Failed to update profile: ' + error.message });
            }
        });
        if (profileImage) {
            cloudinaryConfig_1.default.uploader.upload_stream((error, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
                }
                profileImageUrl = (result === null || result === void 0 ? void 0 : result.secure_url) || '';
                if (newPassword) {
                    // Verify old password and hash new password
                    const isMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
                    if (!isMatch) {
                        return res.status(400).json({ error: 'Old password is incorrect. Please use the forgot password option.' });
                    }
                    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
                    proceedWithUpdate(hashedPassword);
                }
                else {
                    proceedWithUpdate();
                }
            })).end(profileImage);
        }
        else {
            // Hash password if provided and old password is correct
            if (newPassword) {
                const isMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
                if (!isMatch) {
                    return res.status(400).json({ error: 'Old password is incorrect. Please use the forgot password option.' });
                }
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
                proceedWithUpdate(hashedPassword);
            }
            else {
                proceedWithUpdate();
            }
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.updateProfile = updateProfile;
const forgotPasswordHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        yield (0, userService_1.forgotPassword)(email);
        res.status(200).json({ message: "OTP sent to your email" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.forgotPasswordHandler = forgotPasswordHandler;
const resetPasswordHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, newPassword } = req.body;
        yield (0, userService_1.resetPassword)(email, otp, newPassword);
        res.status(200).json({ message: "Password has been reset successfully" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.resetPasswordHandler = resetPasswordHandler;
// Controller to get all categories
const getCategoriesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield (0, userService_1.fetchAllCategories)();
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});
exports.getCategoriesController = getCategoriesController;
const getSlotsByWorkerIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wId } = req.params;
        const slots = yield (0, userService_1.getSlotsByWorkerIdService)(wId);
        return res.status(200).json(slots);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error retrieving slots', error });
    }
});
exports.getSlotsByWorkerIdController = getSlotsByWorkerIdController;
const getUserBookedWorkersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const bookings = yield (0, userService_1.getUserBookedWorkers)(userId);
        res.status(200).json({
            success: true,
            data: bookings,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getUserBookedWorkersController = getUserBookedWorkersController;
