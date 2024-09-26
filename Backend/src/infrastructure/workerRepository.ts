import { Worker } from "../domain/worker";


// Function to create a new worker and save it to the database.
export const createWorker = async (workerData: any): Promise<any> => {
  try {
    const newWorker = new Worker(workerData);
    return await newWorker.save();
  } catch (err: any) {
    throw new Error("Error creating worker: " + err.message);
  }
};

// Function to find a worker by user ID.
export const findWorkerByUserIdInDB = async (userId: string): Promise<any> => {
  return await Worker.findOne({ userId });
};

// Function to get a worker by their ID, including populated categories.
export const getWorkerById = async (_id: string): Promise<any> => {
  return await Worker.findOne({ _id }).populate("categories");
};

// Function to block a worker by their ID.
export const blockWorker = async (_id: string): Promise<any> => {
  return await Worker.findByIdAndUpdate(
    _id,
    { isBlocked: true },
    { new: true }
  );
};

// Function to unblock a worker by their ID.
export const unblockWorker = async (_id: string): Promise<any> => {
  return await Worker.findByIdAndUpdate(
    _id,
    { isBlocked: false },
    { new: true }
  );
};

// Function to find a worker by their ID in the database.
export const findWorkerByIdInDB = async (userId: string): Promise<any> => {
  return await Worker.findById(userId);
};

// Function to update a worker's data by user ID.
export const updateWorkerByIdInDB = async (
  userId: string,
  updateData: any
): Promise<any> => {
  return await Worker.findOneAndUpdate({ userId }, updateData, { new: true });
};

// Function to fetch all workers from the database with populated categories.
export const getAllWorkers = async (): Promise<any> => {
  try {
    return await Worker.find({}).populate("categories", "name description");
  } catch (err: any) {
    throw new Error("Error fetching workers from database: " + err.message);
  }
};
