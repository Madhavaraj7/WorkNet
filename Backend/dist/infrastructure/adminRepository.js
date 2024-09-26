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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookingsWithDetails = exports.getReviewCount = exports.getBookingsCount = exports.getWorkersCount = exports.getUsersCount = exports.deleteReviewById = exports.getAllCategories = exports.createCategory = exports.deleteWorkerById = exports.getAllWorkersFromDB = void 0;
const category_1 = require("../domain/category");
const worker_1 = require("../domain/worker");
const review_1 = require("../domain/review");
const booking_1 = require("../domain/booking");
const userRepository_1 = require("./userRepository");
// Fetch all workers from the database, sorted by creation date.
const getAllWorkersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return worker_1.Worker.find()
        .sort({ createdAt: -1 })
        .populate("categories", "name description");
});
exports.getAllWorkersFromDB = getAllWorkersFromDB;
// Delete a worker by their ID from the database.
const deleteWorkerById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    return worker_1.Worker.findByIdAndDelete(_id);
});
exports.deleteWorkerById = deleteWorkerById;
// Create a new category in the database.
const createCategory = (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
    const category = new category_1.Category(categoryData);
    return yield category.save();
});
exports.createCategory = createCategory;
// Fetch all categories from the database, sorted by name.
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield category_1.Category.find().sort({ name: 1 });
    }
    catch (error) {
        throw new Error("Error fetching categories: " + error.message);
    }
});
exports.getAllCategories = getAllCategories;
// Delete a review by its ID by marking it as deleted.
const deleteReviewById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_id) {
        throw new Error("Invalid review ID.");
    }
    try {
        const updatedReview = yield review_1.Review.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
        if (!updatedReview) {
            throw new Error("Review not found.");
        }
        return updatedReview;
    }
    catch (error) {
        throw new Error("Error updating review status: " + error.message);
    }
});
exports.deleteReviewById = deleteReviewById;
// Get the total count of users in the database.
const getUsersCount = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield userRepository_1.UserModel.countDocuments();
});
exports.getUsersCount = getUsersCount;
// Get the total count of workers in the database.
const getWorkersCount = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield worker_1.Worker.countDocuments();
});
exports.getWorkersCount = getWorkersCount;
// Get the total count of bookings in the database.
const getBookingsCount = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield booking_1.Booking.countDocuments();
});
exports.getBookingsCount = getBookingsCount;
// Get the total count of reviews in the database.
const getReviewCount = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield review_1.Review.countDocuments();
});
exports.getReviewCount = getReviewCount;
// Fetch all confirmed bookings with details of users and workers.
const getAllBookingsWithDetails = () => __awaiter(void 0, void 0, void 0, function* () {
    return booking_1.Booking.find({ status: "Confirmed" })
        .populate("userId", "username")
        .populate("slotId", "date")
        .populate("workerId", "name")
        .select("amount status")
        .exec();
});
exports.getAllBookingsWithDetails = getAllBookingsWithDetails;
