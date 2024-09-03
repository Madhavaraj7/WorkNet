import mongoose, { Document } from 'mongoose';
import {Review,IReview } from '../domain/review';
import {Booking} from '../domain/booking';

// Create a new review
export const createReview = async (reviewData: IReview): Promise<IReview> => {
    const review = new Review(reviewData);
    return await review.save();
};

// Fetch reviews by workerId
export const getReviewsByWorkerId = async (workerId: mongoose.Types.ObjectId): Promise<IReview[]> => {
    return await Review.find({ 
        workerId, 
        isDeleted: false 
    }).populate('userId', 'username profileImage');
};


// Check if a user has already reviewed a worker
export const hasUserReviewedWorker = async (userId: mongoose.Types.ObjectId, workerId: mongoose.Types.ObjectId): Promise<boolean> => {
    const review = await Review.findOne({ userId, workerId });
    return review !== null;
};

// Check if the user has booked the worker
export const hasUserBookedWorker = async (userId: mongoose.Types.ObjectId, workerId: mongoose.Types.ObjectId): Promise<boolean> => {
    const booking = await Booking.findOne({ userId, workerId, status: 'Confirmed' });
    return booking !== null;
};


export const getAllReviewsWithDetails = async () => {
    return await Review.find({ isDeleted: false })  // Filter reviews with isDeleted: false
        .populate('userId', 'username profileImage')  // Populate with user details (name and photo)
        .populate('workerId', 'name')      // Populate with worker details (name)
        .select('workerId userId ratingPoints feedback createdAt updatedAt');
};

