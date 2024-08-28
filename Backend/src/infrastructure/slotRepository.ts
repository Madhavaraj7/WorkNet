import mongoose from 'mongoose';
import { Slot, ISlot } from '../domain/slot';

// Function to create a slot
export const createSlot = async (slotData: { workerId: mongoose.Types.ObjectId; date: Date; startDate?: Date; endDate?: Date; }): Promise<ISlot> => {
    const slot = new Slot(slotData);
    return await slot.save();
};

// Function to find a slot by worker ID and date
export const findSlotByWorkerAndDate = async (
  workerId: mongoose.Types.ObjectId,
  date: Date
): Promise<ISlot | null> => {
  return Slot.findOne({
    workerId,
    date: {
      $eq: date
    }
  }).exec();
};

// Function to get slots by worker ID
export const getSlotsByWorkerIdFromRepo = async (workerId: mongoose.Types.ObjectId): Promise<ISlot[]> => {
  return Slot.find({ workerId }).exec();
};
