import { Request, Response } from 'express';
import { registerWorker, findWorkerByUserId, unblockWorkerService, blockWorkerService } from '../../application/workerService';

interface CustomRequest extends Request {
  userId?: string;
}

export const registerWorkerController = async (req: CustomRequest, res: any): Promise<void> => {
  try {
      const workerData = req.body;
      const files = req.files;
      const userId = req.userId;

      if (!userId) {
          return res.status(400).json({ message: 'userId is required' });
      }

      // Check if the user already registered a worker
      const existingWorker = await findWorkerByUserId(userId);
      if (existingWorker) {
          return res.status(409).json({ message: 'Worker already registered' });
      }

      // Include userId in the worker data
      const newWorker = await registerWorker({ ...workerData, userId }, files);
      res.status(200).json(newWorker);
  } catch (err: any) {
      res.status(500).json({ message: err.message });
  }
};



export const blockWorkerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const blockedWorker = await blockWorkerService(id);
    if (blockedWorker) {
      res.status(200).json({ message: 'Worker blocked successfully', worker: blockedWorker });
    } else {
      res.status(404).json({ message: 'Worker not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const unblockWorkerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const unblockedWorker = await unblockWorkerService(id);
    if (unblockedWorker) {
      res.status(200).json({ message: 'Worker unblocked successfully', worker: unblockedWorker });
    } else {
      res.status(404).json({ message: 'Worker not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};