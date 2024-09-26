import { Request, Response } from "express";
import {
  addReview,
  fetchReviewsForWorker,
} from "../../application/reviewService";
import mongoose from "mongoose";

// Controller to post a new review
export const postReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reviewData = req.body;

    reviewData.userId = new mongoose.Types.ObjectId(reviewData.userId);
    reviewData.workerId = new mongoose.Types.ObjectId(reviewData.workerId);

    const review = await addReview(reviewData);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Failed to add review", error });
  }
};

// Controller to get reviews for a specific worker
export const getReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const workerId = new mongoose.Types.ObjectId(req.params.workerId);
    const reviews = await fetchReviewsForWorker(workerId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error });
  }
};
