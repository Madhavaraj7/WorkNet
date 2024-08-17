import { Request, Response } from 'express';
import { registerWorker } from '../../application/workerService';

export const registerWorkerController = async (req: Request, res: any): Promise<void> => {
  try {
    const workerData = req.body;
    const files = req.files;

    // Ensure that required fields are present
    if (!workerData.status || !workerData.userId) {
      return res.status(400).json({ message: 'status and userId are required' });
    }

    const newWorker = await registerWorker(workerData, files);
    res.status(201).json(newWorker);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
