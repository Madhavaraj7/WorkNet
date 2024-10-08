import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    workerId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    ratingPoints: number;
    feedback?: string;
    userName: string;
    userPhoto?: string;
    isDeleted?: boolean; 
}

const reviewSchema: Schema = new Schema<IReview>({
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ratingPoints: { type: Number, required: true },
    feedback: { type: String },
    userName: { type: String, required: true },
    userPhoto: { type: String },
    isDeleted: { type: Boolean, default: false }, 
}, { timestamps: true });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
