import { blockWorker, createWorker, findWorkerByIdInDB, findWorkerByUserIdInDB, getAllWorkers, getWorkerById, unblockWorker, updateWorkerByIdInDB } from '../infrastructure/workerRepository';
import { uploadToCloudinary } from '../cloudinaryConfig';
import { Category, ICategory } from '../domain/category';
import mongoose from 'mongoose';

// register a worker
// Assuming you need to handle both names and IDs
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

    let categoryIds: string[] = [];
    if (Array.isArray(workerData.categories)) {
      const isIdArray = workerData.categories.every((cat: any) => mongoose.Types.ObjectId.isValid(cat));
      if (isIdArray) {
        categoryIds = workerData.categories as string[];
      } else {
        const categoryNames = workerData.categories as string[];
        const categories = await Category.find({ name: { $in: categoryNames } }) as ICategory[];
        categoryIds = categories.map(cat => cat._id.toString()); 
      }
    } else if (typeof workerData.categories === 'string') {
      const category = await Category.findOne({ name: workerData.categories }) as ICategory | null;
      if (category) {
        categoryIds = [category._id.toString()]; 
      } else {
        throw new Error(`Category not found with name: ${workerData.categories}`);
      }
    }

    // Validate category IDs
    const validCategoryIds = await Promise.all(
      categoryIds.map(async (_id: string) => {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
          throw new Error(`Invalid category ID: ${_id}`);
        }

        const category = await Category.findById(_id) as ICategory | null;
        if (!category) {
          throw new Error(`Category not found with ID: ${_id}`);
        }
        return category._id.toString(); // Ensure _id is converted to string
      })
    );

    // Create worker object
    const worker = {
      ...workerData,
      categories: validCategoryIds,
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