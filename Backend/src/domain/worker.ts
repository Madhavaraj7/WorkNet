import mongoose, { Document, Schema } from 'mongoose';
import { User } from './user'; // Adjust the import path as necessary

interface IWorker extends Document {
  registerImage: string;
  name: string;
  phoneNumber: number;
  whatsappNumber: number;
  categories: string[];
  experience: number;
  workingDays: string;
  availableTime: string;
  address: string;
  paymentMode: string;
  state: string;
  city: string;
  place: string;
  workImages: string[];
  userId: mongoose.Schema.Types.ObjectId; // Reference to the User model
  averageReview?: string;
  status: string;
}

const workerSchema = new Schema<IWorker>({
  registerImage: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  whatsappNumber: {
    type: Number,
    required: true,
  },
  categories: {
    type: [String],
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  workingDays: {
    type: String,
    required: true,
  },
  availableTime: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  paymentMode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  workImages: {
    type: [String],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  averageReview: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: 'pending', // Default status is "pending"
  }
}, { timestamps: true });

export const Worker = mongoose.model<IWorker>('Worker', workerSchema);
