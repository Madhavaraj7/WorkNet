import { createSlot, findSlotByWorkerAndDate, getSlotsByWorkerIdFromRepo } from '../infrastructure/slotRepository';
import { ISlot } from '../domain/slot';
import mongoose from 'mongoose';


// Create slots for a worker within a specified date range, ensuring they don't overlap
export const createWorkerSlots = async (workerId: string, startDate: Date, endDate: Date): Promise<ISlot[]> => {
  const slots: ISlot[] = [];
  const workerObjectId = new mongoose.Types.ObjectId(workerId);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  if (start <= today) {
    throw new Error("Start date must be tomorrow or a future date.");
  }

  const end = new Date(endDate);
  const currentDate = new Date(start);

  while (currentDate <= end) {
    const existingSlot = await findSlotByWorkerAndDate(workerObjectId, new Date(currentDate));

    if (existingSlot) {
      throw new Error(`Slot already exists for worker ${workerId} on ${currentDate.toDateString()}`);
    }

    const slot = await createSlot({
      workerId: workerObjectId,
      date: new Date(currentDate),
      startDate: startDate,
      endDate: endDate
    });

    slots.push(slot);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return slots;
};

// Fetch all slots for a specific worker by their ID
export const getSlotsByWorkerId = async (workerId: string): Promise<ISlot[]> => {
  const workerObjectId = new mongoose.Types.ObjectId(workerId);
  return await getSlotsByWorkerIdFromRepo(workerObjectId);
};
