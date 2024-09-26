import {
  blockWorker,
  createWorker,
  findWorkerByIdInDB,
  findWorkerByUserIdInDB,
  getAllWorkers,
  getWorkerById,
  unblockWorker,
  updateWorkerByIdInDB,
} from "../infrastructure/workerRepository";
import { uploadToCloudinary } from "../cloudinaryConfig";
import { Category, ICategory } from "../domain/category";
import { User } from "../domain/user";
import { UserModel } from "../infrastructure/userRepository";
import { Worker } from "../domain/worker";

import mongoose from "mongoose";
import { Booking } from "../domain/booking";
import { Slot } from "../domain/slot";

// register a worker
export const registerWorker = async (
  workerData: any,
  files: any
): Promise<any> => {
  try {
    const existingWorker = await Worker.findOne({ userId: workerData.userId });
    if (existingWorker) {
      throw new Error("Worker already exists with this user ID");
    }

    const user = await UserModel.findById(workerData.userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.isBlocked) {
      throw new Error("User is blocked and cannot register as a worker");
    }

    let registerImageUrl = "";
    if (files.registerImage) {
      registerImageUrl = await uploadToCloudinary(files.registerImage[0]);
    }

    const workImageUrls: string[] = [];
    if (files.workImages) {
      const workImagePromises = files.workImages.map((file: any) =>
        uploadToCloudinary(file)
      );
      workImageUrls.push(...(await Promise.all(workImagePromises)));
    }

    const kycDetails: { documentType: string; documentImage: string }[] = [];
    if (files.kycDocumentImage && workerData.kycDocumentType) {
      const documentImage = await uploadToCloudinary(files.kycDocumentImage[0]);
      kycDetails.push({
        documentType: workerData.kycDocumentType,
        documentImage,
      });
    }

    let categoryIds: string[] = [];
    if (Array.isArray(workerData.categories)) {
      const isIdArray = workerData.categories.every((cat: any) =>
        mongoose.Types.ObjectId.isValid(cat)
      );
      if (isIdArray) {
        categoryIds = workerData.categories as string[];
      } else {
        const categoryNames = workerData.categories as string[];
        const categories = (await Category.find({
          name: { $in: categoryNames },
        })) as ICategory[];
        categoryIds = categories.map((cat) => cat._id.toString());
      }
    } else if (typeof workerData.categories === "string") {
      const category = (await Category.findOne({
        name: workerData.categories,
      })) as ICategory | null;
      if (category) {
        categoryIds = [category._id.toString()];
      } else {
        throw new Error(
          `Category not found with name: ${workerData.categories}`
        );
      }
    }

    const validCategoryIds = await Promise.all(
      categoryIds.map(async (_id: string) => {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
          throw new Error(`Invalid category ID: ${_id}`);
        }

        const category = (await Category.findById(_id)) as ICategory | null;
        if (!category) {
          throw new Error(`Category not found with ID: ${_id}`);
        }
        return category._id.toString();
      })
    );

    const worker = {
      ...workerData,
      categories: validCategoryIds,
      registerImage: registerImageUrl,
      workImages: workImageUrls,
      kycDetails, 
    };

    const newWorker = await createWorker(worker);

    await UserModel.updateOne(
      { _id: workerData.userId },
      { $set: { role: "pendingworker" } }
    );

    return newWorker;
  } catch (err: any) {
    throw new Error("Error registering worker: " + err.message);
  }
};

// find worker by using userID
export const findWorkerByUserId = async (userId: string): Promise<any> => {
  try {
    const worker = await findWorkerByUserIdInDB(userId);

    return worker;
  } catch (err: any) {
    throw new Error("Error finding worker: " + err.message);
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
export const getLoginedUserWorksService = async (
  userId: string
): Promise<any> => {
  try {
    const loginedUserWorks = await findWorkerByUserIdInDB(userId);

    return loginedUserWorks;
  } catch (err: any) {
    throw new Error("Error fetching works: " + err.message);
  }
};

// update the worker
export const updateWorkerById = async (
  userId: string,
  updateData: any
): Promise<any> => {
  try {
    const updatedWorker = await updateWorkerByIdInDB(userId, updateData);

    return updatedWorker;
  } catch (err: any) {
    throw new Error("Error updating worker: " + err.message);
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
    throw new Error("Error fetching all workers: " + err.message);
  }
};

// get workerId
export const getWorkerByIdService = async (userId: string): Promise<any> => {
  try {
    const worker = await getWorkerById(userId);
    console.log(worker);

    return worker;
  } catch (err: any) {
    throw new Error("Error fetching worker by ID: " + err.message);
  }
};

// get workerAppointments
export const getWorkerAppointmentsService = async (
  workerId: string
): Promise<any> => {
  try {
    const appointments = await Booking.find({ workerId })
      .populate({
        path: "userId",
        select: "username",
        model: UserModel,
      })
      .populate({
        path: "slotId",
        select: "date",
        model: Slot,
      })
      .exec();

    const results = appointments.map((appointment) => ({
      appointmentId: appointment._id,
      userName: (appointment.userId as any).username,
      slotDate: (appointment.slotId as any).date,
      amount: appointment.amount,
      status: appointment.status,
    }));

    return results;
  } catch (err: any) {
    throw new Error("Error fetching appointments: " + err.message);
  }
};
