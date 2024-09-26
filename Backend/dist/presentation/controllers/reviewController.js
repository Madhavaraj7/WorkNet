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
exports.getReviews = exports.postReview = void 0;
const reviewService_1 = require("../../application/reviewService");
const mongoose_1 = __importDefault(require("mongoose"));
// Controller to post a new review
const postReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewData = req.body;
        reviewData.userId = new mongoose_1.default.Types.ObjectId(reviewData.userId);
        reviewData.workerId = new mongoose_1.default.Types.ObjectId(reviewData.workerId);
        const review = yield (0, reviewService_1.addReview)(reviewData);
        res.status(201).json(review);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to add review", error });
    }
});
exports.postReview = postReview;
// Controller to get reviews for a specific worker
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workerId = new mongoose_1.default.Types.ObjectId(req.params.workerId);
        const reviews = yield (0, reviewService_1.fetchReviewsForWorker)(workerId);
        res.status(200).json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch reviews", error });
    }
});
exports.getReviews = getReviews;
