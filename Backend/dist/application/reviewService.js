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
exports.fetchReviewsForWorker = exports.addReview = void 0;
const reviewRepository_1 = require("../infrastructure/reviewRepository");
const addReview = (reviewData) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, workerId } = reviewData;
    try {
        const alreadyReviewed = yield (0, reviewRepository_1.hasUserReviewedWorker)(userId, workerId);
        if (alreadyReviewed) {
            throw new Error('User has already given feedback for this worker.');
        }
        const hasBooked = yield (0, reviewRepository_1.hasUserBookedWorker)(userId, workerId);
        if (!hasBooked) {
            throw new Error('User has not booked this worker.');
        }
        return yield (0, reviewRepository_1.createReview)(reviewData);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || 'An error occurred while processing the review.');
        }
        else {
            throw new Error('An unknown error occurred while processing the review.');
        }
    }
});
exports.addReview = addReview;
const fetchReviewsForWorker = (workerId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, reviewRepository_1.getReviewsByWorkerId)(workerId);
});
exports.fetchReviewsForWorker = fetchReviewsForWorker;
