import mongoose, { Schema, Document } from 'mongoose';

export interface ISlot extends Document {
  workerId: mongoose.Schema.Types.ObjectId;
  date: Date;
  isAvailable: boolean;
}

const slotSchema = new Schema<ISlot>({
  workerId: {
    type: Schema.Types.ObjectId,
    ref: 'Worker',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: true,
  },
}, { timestamps: true });

export const Slot = mongoose.model<ISlot>('Slot', slotSchema);
