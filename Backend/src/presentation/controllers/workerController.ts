import { Request, Response } from 'express';
import { registerWorker, findWorkerByUserId } from '../../application/workerService';

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
