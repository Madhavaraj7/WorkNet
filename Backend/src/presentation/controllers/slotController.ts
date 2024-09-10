import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { createWorkerSlots, getSlotsByWorkerId } from '../../application/slotService';

interface CustomRequest extends Request {
    userId?: string; 
}


interface CustomRequest extends Request {
  workerId?: string; 
}

export const createSlotController = async (req: CustomRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.body;
    console.log({ startDate, endDate });

    if (!req.workerId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.workerId)) {
      return res.status(400).json({ message: 'Invalid workerId format' });
    }

    const slots = await createWorkerSlots(req.workerId, new Date(startDate), new Date(endDate));
    res.status(201).json(slots);
  } catch (error: any) {
    console.error('Error creating slots:', error);
    res.status(500).json({ message: 'Error creating slots', error: error.message });
  }
};


export const getSlotsByWorkerController = async (req: CustomRequest, res: Response) => {
  try {
    const workerId = req.workerId;  

    if (!workerId || !mongoose.Types.ObjectId.isValid(workerId)) {
      return res.status(400).json({ message: 'Invalid workerId format' });
    }

    const slots = await getSlotsByWorkerId(workerId);
    res.status(200).json(slots);
  } catch (error: any) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ message: 'Error fetching slots', error: error.message });
  }
};
