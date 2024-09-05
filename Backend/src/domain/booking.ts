// domain/booking.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  slotId: mongoose.Schema.Types.ObjectId;
  workerId: mongoose.Schema.Types.ObjectId; 
  amount: number; 
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

const bookingSchema = new Schema<IBooking>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  slotId: {
    type: Schema.Types.ObjectId,
    ref: 'Slot',
    required: true,
  },
  workerId: {
    type: Schema.Types.ObjectId,
    ref: 'Worker',
    required: true,
  },
  amount: { 
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
