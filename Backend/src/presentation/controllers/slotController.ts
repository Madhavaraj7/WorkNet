import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { createWorkerSlots } from '../../application/slotService';

interface CustomRequest extends Request {
    userId?: string; // Added the userId field to the request interface
}

export const createSlotController = async (req: CustomRequest, res: Response) => {
  try {
    const { startDate, endDate, isAvailable } = req.body;

    // You don't need workerId from the body, use the userId from the middleware
    if (!req.userId || !startDate || !endDate || typeof isAvailable !== 'boolean') {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Validate the userId (previously workerId)
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    // Create slots using the authenticated user's ID
    const slots = await createWorkerSlots(req.userId, new Date(startDate), new Date(endDate), isAvailable);
    res.status(201).json(slots);
  } catch (error: any) {
    console.error('Error creating slots:', error); 
    res.status(500).json({ message: 'Error creating slots', error: error.message });
  }
};
