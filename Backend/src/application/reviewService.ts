import mongoose from 'mongoose';
import { createReview, hasUserReviewedWorker, hasUserBookedWorker, getReviewsByWorkerId } from '../infrastructure/reviewRepository';
import { IReview } from '../domain/review';



// Add a review for a worker if the user has booked them and hasn't reviewed them before
export const addReview = async (reviewData: IReview): Promise<IReview> => {
    const { userId, workerId } = reviewData;

    try {
        const alreadyReviewed = await hasUserReviewedWorker(userId, workerId);
        if (alreadyReviewed) {
            throw new Error('User has already given feedback for this worker.');
        }

        const hasBooked = await hasUserBookedWorker(userId, workerId);
        if (!hasBooked) {
            throw new Error('User has not booked this worker.');
        }

        return await createReview(reviewData);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || 'An error occurred while processing the review.');
        } else {
            throw new Error('An unknown error occurred while processing the review.');
        }
    }
};

// Fetch all reviews for a specific worker by their ID
export const fetchReviewsForWorker = async (workerId: mongoose.Types.ObjectId): Promise<IReview[]> => {
    return await getReviewsByWorkerId(workerId);
};
