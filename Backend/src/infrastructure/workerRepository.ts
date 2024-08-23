import { Worker } from '../domain/worker';

export const createWorker = async (workerData: any): Promise<any> => {
  try {
    const newWorker = new Worker(workerData);
    return await newWorker.save();
  } catch (err:any) {
    throw new Error('Error creating worker: ' + err.message);
  }
};


export const findWorkerByUserIdInDB = async (userId: string): Promise<any> => {
  // console.log("hello iam");
  
  return await Worker.findOne({ userId });
};

export const getWorkerById = async (_id: string): Promise<any> => {
  return await Worker.findOne({ _id }).populate('categories');
};


export const blockWorker = async (_id: string): Promise<any> => {
  return await Worker.findByIdAndUpdate(_id, { isBlocked: true }, { new: true });
};

export const unblockWorker = async (_id: string): Promise<any> => {
  return await Worker.findByIdAndUpdate(_id, { isBlocked: false }, { new: true });
};


export const findWorkerByIdInDB = async (userId: string): Promise<any> => {
  return await Worker.findById(userId);
};

export const updateWorkerByIdInDB = async (userId: string, updateData: any): Promise<any> => {
  return await Worker.findOneAndUpdate({ userId }, updateData, { new: true });
};;

// Worker Repository
export const getAllWorkers = async (): Promise<any> => {
  try {
    return await Worker.find({}).populate('categories', 'name description');
  } catch (err: any) {
    throw new Error('Error fetching workers from database: ' + err.message);
  }
};


