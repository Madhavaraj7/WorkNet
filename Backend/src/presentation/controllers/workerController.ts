import { Request, Response } from 'express';
import { registerWorker, findWorkerByUserId, unblockWorkerService, blockWorkerService, getLoginedUserWorksService, findWorkerById, updateWorkerById } from '../../application/workerService';
import { uploadToCloudinary } from '../../cloudinaryConfig';

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

      const existingWorker = await findWorkerByUserId(userId);
      console.log(existingWorker,"backend ");
      
      if (existingWorker) {
          return res.status(409).json({ message: 'Worker already registered' });
      }
     

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


export const getLoginedUserWorksController = async (req: CustomRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  // console.log(userId,"get");
  

  try {
      const loginedUserWorks = await getLoginedUserWorksService(userId as string);
      // console.log("con",loginedUserWorks);
      

      if (loginedUserWorks) {
          res.status(200).json(loginedUserWorks);
      } else {
          res.status(403).json("You are not a worker. If you are a worker, please register!!");
      }
  } catch (err: any) {
      res.status(401).json({ message: err.message });
  }
};




export const updateWorkerController = async (req: CustomRequest, res: any): Promise<void> => {
  try {
    const userId = req.userId;
    const workerData = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Type-cast here

    if (!userId) {
      return res.status(401).json({ message: 'User ID is required' });
    }

    // Fetch existing worker by userId
    const existingWorker = await findWorkerByUserId(userId);
    console.log("update worker", existingWorker);
    
    if (!existingWorker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    // Handle register image upload
    let registerImageUrl = existingWorker.registerImage; 
    if (files.registerImage?.[0]) { 
      registerImageUrl = await uploadToCloudinary(files.registerImage[0]);
    }

    // Handle work images upload
    const workImageUrls = existingWorker.workImages; 
    if (files.workImages) {
      const workImagePromises = files.workImages.map((file: Express.Multer.File) => uploadToCloudinary(file));
      workImageUrls.push(...await Promise.all(workImagePromises));
    }

    // Update worker data
    const updatedWorker = await updateWorkerById(userId, {
      ...workerData,
      registerImage: registerImageUrl,
      workImages: workImageUrls,
    });

    res.status(200).json(updatedWorker);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};