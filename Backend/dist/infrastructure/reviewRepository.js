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
exports.getAllReviewsWithDetails = exports.hasUserBookedWorker = exports.hasUserReviewedWorker = exports.getReviewsByWorkerId = exports.createReview = void 0;
const review_1 = require("../domain/review");
const booking_1 = require("../domain/booking");
// Create a new review
const createReview = (reviewData) => __awaiter(void 0, void 0, void 0, function* () {
    const review = new review_1.Review(reviewData);
    return yield review.save();
});
exports.createReview = createReview;
// Fetch reviews by workerId
const getReviewsByWorkerId = (workerId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield review_1.Review.find({
        workerId,
        isDeleted: false
    }).populate('userId', 'username profileImage');
});
exports.getReviewsByWorkerId = getReviewsByWorkerId;
const hasUserReviewedWorker = (userId, workerId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_1.Review.findOne({ userId, workerId });
    return review !== null;
});
exports.hasUserReviewedWorker = hasUserReviewedWorker;
const hasUserBookedWorker = (userId, workerId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_1.Booking.findOne({ userId, workerId, status: 'Confirmed' });
    return booking !== null;
});
exports.hasUserBookedWorker = hasUserBookedWorker;
const getAllReviewsWithDetails = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield review_1.Review.find({ isDeleted: false })
        .populate('userId', 'username profileImage')
        .populate('workerId', 'name')
        .select('workerId userId ratingPoints feedback createdAt updatedAt');
});
exports.getAllReviewsWithDetails = getAllReviewsWithDetails;
