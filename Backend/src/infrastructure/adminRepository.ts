
import { Worker } from '../domain/worker';

export const getAllWorkersFromDB = async () => {
  return Worker.find().sort({ createdAt: -1 });
};



export const deleteWorkerById = async (_id: string) => {
  return Worker.findByIdAndDelete(_id);
};