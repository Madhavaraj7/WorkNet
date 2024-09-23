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
const getAllWorkersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return worker_1.Worker.find().sort({ createdAt: -1 }).populate('categories', 'name description');
});
exports.getAllWorkersFromDB = getAllWorkersFromDB;
const deleteWorkerById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    return worker_1.Worker.findByIdAndDelete(_id);
});
exports.deleteWorkerById = deleteWorkerById;
const createCategory = (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
    const category = new category_1.Category(categoryData);
    return yield category.save();
});
exports.createCategory = createCategory;
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield category_1.Category.find().sort({ name: 1 });
    }
    catch (error) {
        throw new Error('Error fetching categories: ' + error.message);
    }
});
exports.getAllCategories = getAllCategories;
const deleteReviewById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Marking review as deleted with ID:", _id);
    if (!_id) {
        throw new Error("Invalid review ID.");
    }
    try {
        const updatedReview = yield review_1.Review.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
        console.log("Updated review:", updatedReview);
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
const getUsersCount = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield userRepository_1.UserModel.countDocuments();
});
exports.getUsersCount = getUsersCount;
const getWorkersCount = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield worker_1.Worker.countDocuments();
});
exports.getWorkersCount = getWorkersCount;
const getBookingsCount = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield booking_1.Booking.countDocuments();
});
exports.getBookingsCount = getBookingsCount;
const getReviewCount = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield review_1.Review.countDocuments();
});
exports.getReviewCount = getReviewCount;
const getAllBookingsWithDetails = () => __awaiter(void 0, void 0, void 0, function* () {
    return booking_1.Booking.find({ status: 'Confirmed' })
        .populate('userId', 'username')
        .populate('slotId', 'date')
        .populate('workerId', 'name')
        .select('amount status')
        .exec();
});
exports.getAllBookingsWithDetails = getAllBookingsWithDetails;
