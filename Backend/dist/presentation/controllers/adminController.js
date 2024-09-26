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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookings = exports.getBookingTrendsController = exports.getAllCounts = exports.deleteReviewController = exports.getAllReviewsWithDetailsController = exports.editCategoryController = exports.getCategoriesController = exports.addCategoryController = exports.deleteWorkerController = exports.updateWorkerStatusController = exports.getAllWorkersController = exports.unblockUserController = exports.blockUserController = exports.getUsersList = exports.adminupdateProfile = exports.adminlogin = void 0;
exports.getDailyRevenue = getDailyRevenue;
const adminService_1 = require("../../application/adminService");
const cloudinaryConfig_1 = __importDefault(require("../../cloudinaryConfig"));
const userRepository_1 = require("../../infrastructure/userRepository");
const mongoose_1 = __importDefault(require("mongoose"));
const adminRepository_1 = require("../../infrastructure/adminRepository");
const adminService = __importStar(require("../../application/adminService"));
// Admin login function
const adminlogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const result = yield (0, adminService_1.loginUser)(email, password);
        if (result) {
            res.json({ token: result.token, user: result.user });
        }
        else {
            res.status(401).json({ message: "Login failed" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.adminlogin = adminlogin;
// Update admin profile
const adminupdateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const { username, email } = req.body;
        const profileImage = req.file ? req.file.buffer : null;
        let profileImageUrl = "";
        const proceedWithUpdate = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const updatedUser = yield (0, adminService_1.updateUserProfile)(userId, {
                    username,
                    email,
                    profileImage: profileImageUrl || undefined,
                });
                res.status(200).json(updatedUser);
            }
            catch (error) {
                res
                    .status(400)
                    .json({ error: "Failed to update profile: " + error.message });
            }
        });
        if (profileImage) {
            // Upload the image to Cloudinary
            cloudinaryConfig_1.default.uploader
                .upload_stream((error, result) => {
                if (error) {
                    return res
                        .status(500)
                        .json({ error: "Failed to upload image to Cloudinary" });
                }
                profileImageUrl = (result === null || result === void 0 ? void 0 : result.secure_url) || "";
                console.log("Cloudinary URL:", profileImageUrl); // Add logging
                proceedWithUpdate();
            })
                .end(profileImage);
        }
        else {
            proceedWithUpdate(); // No image provided, proceed with updating other fields
        }
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "Failed to update profile: " + error.message });
    }
});
exports.adminupdateProfile = adminupdateProfile;
// Get all users
const getUsersList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, adminService_1.getAllUsers)();
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
});
exports.getUsersList = getUsersList;
// Block a user
const blockUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const blockedUser = yield (0, adminService_1.blockUser)(userId);
        res
            .status(200)
            .json({ message: "User blocked successfully", user: blockedUser });
    }
    catch (error) {
        next(error);
    }
});
exports.blockUserController = blockUserController;
// Unblock a user
const unblockUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const unblockedUser = yield (0, adminService_1.unblockUser)(userId);
        res
            .status(200)
            .json({ message: "User unblocked successfully", user: unblockedUser });
    }
    catch (error) {
        next(error);
    }
});
exports.unblockUserController = unblockUserController;
// Get all workers
const getAllWorkersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allWorkers = yield (0, adminService_1.getAllWorkers)();
        res.status(200).json(allWorkers);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to retrieve workers" });
    }
});
exports.getAllWorkersController = getAllWorkersController;
// Update worker status
const updateWorkerStatusController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (status !== "approved" && status !== "rejected") {
        return res.status(400).json({ message: "Invalid status value" });
    }
    try {
        const updatedWorker = yield (0, adminService_1.updateWorkerStatus)(id, status);
        res.status(200).json(updatedWorker);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateWorkerStatusController = updateWorkerStatusController;
// Deletes a specified worker by ID
const deleteWorkerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workerId = req.params.id;
        yield (0, adminService_1.deleteWorker)(workerId);
        res.status(200).json({ message: "Worker deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteWorkerController = deleteWorkerController;
// Adds a new category if it does not already exist
const addCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    try {
        const existingCategory = yield (0, adminService_1.findCategoryByName)(name);
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }
        const newCategory = yield (0, adminService_1.addCategory)(name, description);
        res.status(201).json(newCategory);
    }
    catch (error) {
        next(error);
    }
});
exports.addCategoryController = addCategoryController;
// Retrieves the list of all categories
const getCategoriesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield (0, userRepository_1.getAllCategories)();
        res.status(200).json(categories);
    }
    catch (error) {
        next(error);
    }
});
exports.getCategoriesController = getCategoriesController;
// Updates an existing category by ID
const editCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
    }
    try {
        const updatedCategory = yield (0, adminService_1.updateCategory)(id, { name, description });
        if (updatedCategory) {
            res.status(200).json(updatedCategory);
        }
        else {
            res.status(404).json({ message: "Category not found" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.editCategoryController = editCategoryController;
// Get all reviews with details
const getAllReviewsWithDetailsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield (0, adminService_1.fetchAllReviewsWithDetails)();
        console.log(reviews);
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});
exports.getAllReviewsWithDetailsController = getAllReviewsWithDetailsController;
// Delete a review
const deleteReviewController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewId = req.params.id;
        const result = yield (0, adminRepository_1.deleteReviewById)(reviewId);
        if (result) {
            return res
                .status(200)
                .json({ message: "Review marked as deleted successfully." });
        }
        else {
            return res.status(404).json({ message: "Review not found." });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Failed to mark review as deleted.", error });
    }
});
exports.deleteReviewController = deleteReviewController;
// Retrieves various counts related to admin statistics
const getAllCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const counts = yield adminService.getAllCounts();
        res.status(200).json(counts);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching counts", error });
    }
});
exports.getAllCounts = getAllCounts;
// Retrieves daily revenue data for the admin
const getBookingTrendsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        const bookingTrends = yield (0, adminService_1.getBookingTrends)(new Date(startDate), new Date(endDate));
        res.status(200).json(bookingTrends);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching booking trends", error });
    }
});
exports.getBookingTrendsController = getBookingTrendsController;
// Retrieves booking trends over a specified period
function getDailyRevenue(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const year = parseInt(req.query.year, 10);
            const month = parseInt(req.query.month, 10);
            const day = parseInt(req.query.day, 10);
            console.log("Year:", year, "Month:", month, "Day:", day);
            if (isNaN(year) ||
                isNaN(month) ||
                isNaN(day) ||
                month < 1 ||
                month > 12 ||
                day < 1 ||
                day > 31) {
                res.status(400).json({ error: "Invalid year, month, or day" });
                return;
            }
            const revenue = yield (0, adminService_1.fetchDailyRevenue)(year, month, day);
            res.status(200).json({ year, month, day, revenue });
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "An error occurred while fetching daily revenue" });
        }
    });
}
// Retrieves all bookings for the admin
const getAllBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield (0, adminService_1.fetchAllBookings)();
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllBookings = getAllBookings;
