import mongoose, { Document } from "mongoose";
import { Review, IReview } from "../domain/review";
import { Booking } from "../domain/booking";

// Create a new review and save it to the database.
export const createReview = async (reviewData: IReview): Promise<IReview> => {
  const review = new Review(reviewData);
  return await review.save();
};

// Fetch reviews for a specific worker by their ID, excluding deleted reviews.
export const getReviewsByWorkerId = async (
  workerId: mongoose.Types.ObjectId
): Promise<IReview[]> => {
  return await Review.find({
    workerId,
    isDeleted: false,
  }).populate("userId", "username profileImage");
};

// Check if a user has already reviewed a specific worker.
export const hasUserReviewedWorker = async (
  userId: mongoose.Types.ObjectId,
  workerId: mongoose.Types.ObjectId
): Promise<boolean> => {
  const review = await Review.findOne({ userId, workerId });
  return review !== null;
};


// Check if a user has a confirmed booking with a specific worker.
export const hasUserBookedWorker = async (
  userId: mongoose.Types.ObjectId,
  workerId: mongoose.Types.ObjectId
): Promise<boolean> => {
  const booking = await Booking.findOne({
    userId,
    workerId,
    status: "Confirmed",
  });
  return booking !== null;
};


// Fetch all reviews with user and worker details, excluding deleted reviews.
export const getAllReviewsWithDetails = async () => {
  return await Review.find({ isDeleted: false })
    .populate("userId", "username profileImage")
    .populate("workerId", "name")
    .select("workerId userId ratingPoints feedback createdAt updatedAt");
};
