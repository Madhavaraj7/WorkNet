import { createWorker } from '../infrastructure/workerRepository';
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

    // Ensure required fields are present
    const { status, userId } = workerData;
    if (!status || !userId) {
      throw new Error('status and userId are required');
    }

    // Create the worker data
    const worker = {
      ...workerData,
      registerImage: registerImageUrl,
      workImages: workImageUrls,
    };

    return await createWorker(worker);
  } catch (err: any) {
    throw new Error('Error registering worker: ' + err.message);
  }
};
