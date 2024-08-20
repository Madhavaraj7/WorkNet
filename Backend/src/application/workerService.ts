import { blockWorker, createWorker, findWorkerByUserIdInDB, getWorkerById, unblockWorker } from '../infrastructure/workerRepository';
import { uploadToCloudinary } from '../cloudinaryConfig';

export const registerWorker = async (workerData: any, files: any): Promise<any> => {
  try {
      // Handle register image upload
      let registerImageUrl = '';
      if (files.registerImage) {
          registerImageUrl = await uploadToCloudinary(files.registerImage[0]);
      }

      // Handle work images upload
      const workImageUrls: string[] = [];
      if (files.workImages) {
          const workImagePromises = files.workImages.map((file: any) => uploadToCloudinary(file));
          workImageUrls.push(...await Promise.all(workImagePromises));
      }

      // Create the worker data
      const worker = {
          ...workerData, // userId is included here
          registerImage: registerImageUrl,
          workImages: workImageUrls,
      };

      return await createWorker(worker);
  } catch (err: any) {
      throw new Error('Error registering worker: ' + err.message);
  }
};

export const findWorkerByUserId = async (userId: string): Promise<any> => {
    try {
        const worker = await findWorkerByUserIdInDB(userId);
        return worker;
    } catch (err: any) {
        throw new Error('Error finding worker: ' + err.message);
    }
  };


  export const blockWorkerService = async (workerId: string): Promise<any> => {
    return await blockWorker(workerId);
  };
  
  export const unblockWorkerService = async (workerId: string): Promise<any> => {
    return await unblockWorker(workerId);
  };

// Get worker details by ID
export const getLoginedUserWorksService = async (userId: string): Promise<any> => {
  try {
    const loginedUserWorks = await findWorkerByUserIdInDB(userId);
    console.log("get login",loginedUserWorks);
    
    return loginedUserWorks;
  } catch (err: any) {
    throw new Error('Error fetching works: ' + err.message);
  }
};