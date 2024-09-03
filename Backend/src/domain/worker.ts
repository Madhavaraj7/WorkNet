import mongoose, { Document, Schema } from 'mongoose';

interface IKycDocument {
  documentType: string;  
  documentImage: string;  
}

interface IWorker extends Document {
  registerImage: string;
  name: string;
  phoneNumber: number;
  whatsappNumber: number;
  categories: mongoose.Schema.Types.ObjectId[];  
  experience: number;
  workingDays: string;
  availableTime: string;
  address: string;
  paymentMode: string;
  state: string;
  city: string;
  place: string;
  workImages: string[];
  userId: mongoose.Schema.Types.ObjectId; 
  averageReview?: number;
  status: string;
  isBlocked?: boolean;
  amount: number;  
  kycDetails: IKycDocument[];  
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
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',  // Reference to the Category model
    required: true,
  }],
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
  
  workImages: {
    type: [String],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  averageReview: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    required: true,
    default: 'pending', 
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  kycDetails: [{
    documentType: {
      type: String,
      required: true,
    },
    documentImage: {
      type: String,
      required: true,
    },
  }],
}, { timestamps: true });

export const Worker = mongoose.model<IWorker>('Worker', workerSchema);
