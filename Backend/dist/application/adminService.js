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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReviewById = exports.fetchAllBookings = exports.getBookingTrends = exports.getAllCounts = exports.fetchAllReviewsWithDetails = exports.findCategoryByName = exports.updateCategory = exports.addCategory = exports.deleteWorker = exports.updateWorkerStatus = exports.getAllWorkers = exports.unblockUser = exports.blockUser = exports.getAllUsers = exports.updateUserProfile = exports.loginUser = void 0;
exports.fetchDailyRevenue = fetchDailyRevenue;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = require("../infrastructure/userRepository");
const errorHandler_1 = require("../utils/errorHandler");
const adminRepository_1 = require("../infrastructure/adminRepository");
const worker_1 = require("../domain/worker");
const category_1 = require("../domain/category");
const userRepository_2 = require("../infrastructure/userRepository");
const adminRepository = __importStar(require("../infrastructure/adminRepository"));
const mongoose_1 = __importDefault(require("mongoose"));
const sendEamilForApprove_1 = require("../utils/sendEamilForApprove");
const reviewRepository_1 = require("../infrastructure/reviewRepository");
const adminRepository_2 = require("../infrastructure/adminRepository");
const booking_1 = require("../domain/booking");
// Function to log in an admin user
// Verifies credentials, checks if user is verified, and generates JWT token
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const validUser = yield (0, userRepository_1.findUserByEmailAdmin)(email);
    if (!validUser) {
        throw (0, errorHandler_1.errorHandler)(404, "User not found");
    }
    const validPassword = bcrypt_1.default.compareSync(password, validUser.password);
    if (!validPassword) {
        throw (0, errorHandler_1.errorHandler)(401, "Wrong credentials");
    }
    if (validUser.is_verified !== 1) {
        throw (0, errorHandler_1.errorHandler)(403, "User is not verified");
    }
    const token = jsonwebtoken_1.default.sign({
        userId: validUser._id,
        isVerified: validUser.is_verified,
        role: validUser.role, // Include role in token payload
    }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    const { password: hashedPassword } = validUser, rest = __rest(validUser, ["password"]);
    return { token, user: rest };
});
exports.loginUser = loginUser;
// Function to update a user's profile
// Updates profile information for an admin user
const updateUserProfile = (userId, update) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield (0, userRepository_1.updateAdminProfile)(userId, update);
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
// Fetch all users
// Retrieves all users from the database
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, userRepository_1.findAllUsers)();
});
exports.getAllUsers = getAllUsers;
// Function to block a user
// Marks a user as blocked in the database
const blockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userRepository_1.findUserById)(userId);
    if (!user) {
        throw (0, errorHandler_1.errorHandler)(404, "User not found");
    }
    if (user.isBlocked) {
        throw (0, errorHandler_1.errorHandler)(400, "User is already blocked");
    }
    return (0, userRepository_1.blockUserById)(userId);
});
exports.blockUser = blockUser;
// Function to unblock a user
// Marks a user as unblocked in the database
const unblockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userRepository_1.findUserById)(userId);
    if (!user) {
        throw (0, errorHandler_1.errorHandler)(404, "User not found");
    }
    if (!user.isBlocked) {
        throw (0, errorHandler_1.errorHandler)(400, "User is not blocked");
    }
    return (0, userRepository_1.unblockUserById)(userId);
});
exports.unblockUser = unblockUser;
// Function to Get all workers
// Retrieves all workers from the database
const getAllWorkers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, adminRepository_1.getAllWorkersFromDB)();
});
exports.getAllWorkers = getAllWorkers;
// Function to update worker status
// Approves or rejects a worker's application and sends a notification email
const updateWorkerStatus = (_id, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const worker = yield worker_1.Worker.findOne({ _id });
        console.log("worker", worker);
        if (!worker) {
            throw new Error("Worker not found");
        }
        const updatedWorker = yield worker_1.Worker.findOneAndUpdate({ _id }, { status }, { new: true });
        const user = yield userRepository_2.UserModel.findOne({ _id: worker.userId });
        if (!user) {
            throw new Error("User not found");
        }
        if (status === "approved") {
            yield userRepository_2.UserModel.findOneAndUpdate({ _id: worker.userId }, { role: "worker" }, { new: true });
        }
        const emailSubject = status === "approved"
            ? "Worker Status Approved"
            : "Worker Status Rejected";
        const emailBody = status === "approved"
            ? "Congratulations! Your worker status has been approved please login again."
            : "We regret to inform you that your worker status has been rejected.";
        yield (0, sendEamilForApprove_1.sendEmail)({
            to: user.email,
            subject: emailSubject,
            body: emailBody,
        });
        return updatedWorker;
    }
    catch (error) {
        console.error(`Failed to update worker status: ${error.message}`);
        throw new Error(`Failed to update worker status: ${error.message}`);
    }
});
exports.updateWorkerStatus = updateWorkerStatus;
// Function to delete a worker
// Blocks a worker and marks their user account as blocked in the database
const deleteWorker = (workerId) => __awaiter(void 0, void 0, void 0, function* () {
    const worker = yield worker_1.Worker.findById(workerId);
    if (!worker) {
        throw (0, errorHandler_1.errorHandler)(404, "Worker not found");
    }
    worker.isBlocked = true;
    yield worker.save();
    const userId = worker.userId;
    const user = yield userRepository_2.UserModel.findById(userId);
    if (!user) {
        throw (0, errorHandler_1.errorHandler)(404, "User not found");
    }
    user.isBlocked = true;
    yield user.save();
    return yield (0, adminRepository_1.deleteWorkerById)(workerId);
});
exports.deleteWorker = deleteWorker;
// Function to add a new category
// Creates a new category in the system
const addCategory = (name, description) => __awaiter(void 0, void 0, void 0, function* () {
    const newCategory = yield (0, adminRepository_1.createCategory)({ name, description });
    return newCategory;
});
exports.addCategory = addCategory;
// Function to update a category
// Updates details of an existing category by its ID
const updateCategory = (_id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(_id)) {
        throw new Error("Invalid category ID");
    }
    try {
        const updatedCategory = yield category_1.Category.findByIdAndUpdate(_id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!updatedCategory) {
            throw new Error("Category not found");
        }
        return updatedCategory;
    }
    catch (error) {
        console.error("Error updating category:", error);
        throw new Error("Failed to update category");
    }
});
exports.updateCategory = updateCategory;
// Function to find a category by name
// Searches for a category by its name
const findCategoryByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return category_1.Category.findOne({ name });
});
exports.findCategoryByName = findCategoryByName;
// Function to fetch all reviews with details
// Retrieves all reviews along with additional details
const fetchAllReviewsWithDetails = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, reviewRepository_1.getAllReviewsWithDetails)();
});
exports.fetchAllReviewsWithDetails = fetchAllReviewsWithDetails;
// Function to get counts of users, workers, bookings, and reviews
// Fetches the count of various entities in the system
const getAllCounts = () => __awaiter(void 0, void 0, void 0, function* () {
    const usersCount = yield adminRepository.getUsersCount();
    const workersCount = yield adminRepository.getWorkersCount();
    const bookingsCount = yield adminRepository.getBookingsCount();
    const reviewCount = yield adminRepository.getReviewCount();
    return { usersCount, workersCount, bookingsCount, reviewCount };
});
exports.getAllCounts = getAllCounts;
// Function to get booking trends
// Fetches the count of bookings between two dates, grouped by day
const getBookingTrends = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const bookings = yield booking_1.Booking.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    return bookings.map((booking) => ({
        date: booking._id,
        count: booking.count,
    }));
});
exports.getBookingTrends = getBookingTrends;
// Function to fetch daily revenue
// Retrieves total revenue for a specific day
function fetchDailyRevenue(year, month, day) {
    return __awaiter(this, void 0, void 0, function* () {
        const startDate = new Date(year, month - 1, day, 0, 0, 0);
        const endDate = new Date(year, month - 1, day + 1, 0, 0, 0);
        const result = yield booking_1.Booking.aggregate([
            {
                $match: {
                    status: "Confirmed",
                    createdAt: { $gte: startDate, $lt: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount" },
                },
            },
        ]);
        return result.length > 0 ? result[0].totalRevenue : 0;
    });
}
// Function to fetch daily revenue
// Retrieves total revenue for a specific day
const fetchAllBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield (0, adminRepository_1.getAllBookingsWithDetails)();
        return bookings;
    }
    catch (error) {
        throw new Error(`Error fetching bookings: ${error.message}`);
    }
});
exports.fetchAllBookings = fetchAllBookings;
// Function to delete a review
// Deletes a review from the database by its ID
const deleteReviewById = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, adminRepository_2.deleteReviewById)(reviewId);
});
exports.deleteReviewById = deleteReviewById;
