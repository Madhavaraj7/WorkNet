
import { Worker } from '../domain/worker';

export const getAllWorkersFromDB = async () => {
  return Worker.find().sort({ createdAt: -1 });
};
