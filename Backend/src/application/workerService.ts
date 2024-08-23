import { blockWorker, createWorker, findWorkerByIdInDB, findWorkerByUserIdInDB, getAllWorkers, getWorkerById, unblockWorker, updateWorkerByIdInDB } from '../infrastructure/workerRepository';
import { uploadToCloudinary } from '../cloudinaryConfig';
import { Category } from '../domain/category';
import mongoose from 'mongoose';

// register a worker
export const registerWorker = async (workerData: any, files: any): Promise<any> => {
  try {
      let registerImageUrl = '';
      if (files.registerImage) {
          registerImageUrl = await uploadToCloudinary(files.registerImage[0]);
      }

      const workImageUrls: string[] = [];
      if (files.workImages) {
          const workImagePromises = files.workImages.map((file: any) => uploadToCloudinary(file));
          workImageUrls.push(...await Promise.all(workImagePromises));
      }

      // Ensure categories is an array
      let categoryIds: string[] = [];
      if (Array.isArray(workerData.categories)) {
          categoryIds = workerData.categories;
      } else if (typeof workerData.categories === 'string') {
          categoryIds = [workerData.categories];
      }

      // Validate and map category IDs
      const validCategoryIds = await Promise.all(
        categoryIds.map(async (categoryId: string) => {
          if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            throw new Error(`Invalid category ID: ${categoryId}`);
          }
          const category = await Category.findById(categoryId);
          if (!category) {
            throw new Error(`Category not found with ID: ${categoryId}`);
          }
          return category._id;
        })
      );

      const worker = {
          ...workerData,
          categories: validCategoryIds, // Ensure this is an array of valid ObjectId references
          registerImage: registerImageUrl,
          workImages: workImageUrls,
      };

      return await createWorker(worker);
  } catch (err: any) {
      throw new Error('Error registering worker: ' + err.message);
  }
};

// find worker by using userID
export const findWorkerByUserId = async (userId: string): Promise<any> => {
    try {
        const worker = await findWorkerByUserIdInDB(userId);
        // console.log(worker);
        
        return worker;
    } catch (err: any) {
        throw new Error('Error finding worker: ' + err.message);
    }
  };


// block the worker
  export const blockWorkerService = async (workerId: string): Promise<any> => {
    return await blockWorker(workerId);
  };
  
// unblock the worker
  export const unblockWorkerService = async (workerId: string): Promise<any> => {
    return await unblockWorker(workerId);
  };

// Get worker details by ID
export const getLoginedUserWorksService = async (userId: string): Promise<any> => {
  try {
    const loginedUserWorks = await findWorkerByUserIdInDB(userId);
    // console.log("get login",loginedUserWorks);
    
    return loginedUserWorks;
  } catch (err: any) {
    throw new Error('Error fetching works: ' + err.message);
  }
};


// update the worker
export const updateWorkerById = async (userId: string, updateData: any): Promise<any> => {
  try {
    const updatedWorker = await updateWorkerByIdInDB(userId, updateData);
    // console.log("updated",updatedWorker);
    
    return updatedWorker;
  } catch (err: any) {
    throw new Error('Error updating worker: ' + err.message);
  }
};


// find the worker
export const findWorkerById = async (userId: string): Promise<any> => {
  return await findWorkerByIdInDB(userId);
};

// get all workerService
export const getAllWorkersService = async (): Promise<any> => {
  try {
    const workers = await getAllWorkers();
    return workers;
  } catch (err: any) {
    throw new Error('Error fetching all workers: ' + err.message);
  }
};

// get workerId
export const getWorkerByIdService = async (userId: string): Promise<any> => {
  try {
    const worker = await getWorkerById(userId);
    console.log(worker);
    
    return worker;
  } catch (err: any) {
    throw new Error('Error fetching worker by ID: ' + err.message);
  }
};