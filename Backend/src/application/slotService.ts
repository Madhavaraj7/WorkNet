import { createSlot, findSlotByWorkerAndDate } from '../infrastructure/slotRepository';
import { ISlot } from '../domain/slot';
import { Worker } from '../domain/worker';  // Import Worker model

import mongoose from 'mongoose';

export const createWorkerSlots = async (workerId: string, startDate: Date, endDate: Date, isAvailable: boolean): Promise<ISlot[]> => {
  const slots: ISlot[] = [];

  // Ensure workerId is an ObjectId
  const workerObjectId = new mongoose.Types.ObjectId(workerId);

  // const worker = await Worker.findById(workerObjectId).exec();
  // if (!worker) {
  //   throw new Error(`Worker with ID ${workerId} does not exist`);
  // }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const currentDate = new Date(start);

  while (currentDate <= end) {
    // Check if the slot already exists
    const existingSlot = await findSlotByWorkerAndDate(workerObjectId, new Date(currentDate));

    if (existingSlot) {
      // If slot already exists, throw an error or handle it as needed
      throw new Error(`Slot already exists for worker ${workerId} on ${currentDate.toDateString()}`);
    }

    // Create new slot if it doesn't exist
    const slot = await createSlot({
      workerId: workerObjectId,
      date: new Date(currentDate),
      isAvailable
    });
    slots.push(slot);
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  return slots;
};
