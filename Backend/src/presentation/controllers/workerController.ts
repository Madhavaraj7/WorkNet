import { Request, Response } from "express";
import {
  registerWorker,
  findWorkerByUserId,
  unblockWorkerService,
  blockWorkerService,
  getLoginedUserWorksService,
  findWorkerById,
  updateWorkerById,
  getAllWorkersService,
  getWorkerByIdService,
  getWorkerAppointmentsService,
} from "../../application/workerService";
import cloudinary, { uploadToCloudinary } from "../../cloudinaryConfig";
import mongoose from "mongoose";

interface CustomRequest extends Request {
  userId?: string;
}

export const registerWorkerController = async (
  req: CustomRequest,
  res: any
): Promise<void> => {
  try {
    const workerData = req.body;
    const files = req.files;
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const existingWorker = await findWorkerByUserId(userId);
    if (existingWorker) {
      return res.status(409).json({ message: "Worker already registered" });
    }

    const newWorker = await registerWorker({ ...workerData, userId }, files);
    res.status(200).json(newWorker);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getWorkersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const workers = await getAllWorkersService();
    res.status(200).json(workers);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const blockWorkerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const blockedWorker = await blockWorkerService(id);
    if (blockedWorker) {
      res
        .status(200)
        .json({
          message: "Worker blocked successfully",
          worker: blockedWorker,
        });
    } else {
      res.status(404).json({ message: "Worker not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const unblockWorkerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const unblockedWorker = await unblockWorkerService(id);
    if (unblockedWorker) {
      res
        .status(200)
        .json({
          message: "Worker unblocked successfully",
          worker: unblockedWorker,
        });
    } else {
      res.status(404).json({ message: "Worker not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLoginedUserWorksController = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId;
  // console.log(userId,"get");

  try {
    const loginedUserWorks = await getLoginedUserWorksService(userId as string);
    // console.log("con",loginedUserWorks);

    if (loginedUserWorks) {
      res.status(200).json(loginedUserWorks);
    } else {
      res
        .status(403)
        .json("You are not a worker. If you are a worker, please register!!");
    }
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const updateWorkerController = async (
  req: CustomRequest,
  res: any
): Promise<void> => {
  try {
    const userId = req.userId;
    let { categories, ...workerData } = req.body;

    console.log({categories,...workerData});
    
    
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    console.log(files);
    

    if (!userId) {
      return res.status(401).json({ message: "User ID is required" });
    }

    const existingWorker = await findWorkerByUserId(userId);
    if (!existingWorker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Handle register image upload
    let registerImageUrl = existingWorker.registerImage;
    if (files.registerImage?.[0]) {
      if (registerImageUrl) {
        await deleteFromCloudinary(registerImageUrl);
      }
      registerImageUrl = await uploadToCloudinary(files.registerImage[0]);
    }

    // Handle work images upload
    const workImageUrls: string[] = [];
    if (files.workImages) {
      // Remove old work images if they exist
      for (const oldImageUrl of existingWorker.workImages) {
        await deleteFromCloudinary(oldImageUrl);
      }
      // Upload new work images
      const workImagePromises = files.workImages.map((file: any) =>
        uploadToCloudinary(file)
      );
      workImageUrls.push(...(await Promise.all(workImagePromises)));
    } else {
      // If no new work images are provided, keep the existing ones
      workImageUrls.push(...existingWorker.workImages);
    }

    // Handle and parse categories if provided
    if (categories) {
      // Ensure categories is an array
      if (typeof categories === "string") {
        try {
          categories = JSON.parse(categories);
        } catch (err) {
          return res.status(400).json({ message: "Invalid categories format" });
        }
      }

      // Verify that categories is an array
      if (!Array.isArray(categories)) {
        return res.status(400).json({ message: "Categories must be an array" });
      }

      // Convert each category to a valid ObjectId
      categories = categories.map((category: string) => {
        return new mongoose.Types.ObjectId(category); // Convert string to ObjectId
      });
    } else {
      // Default to existing categories if none provided
      categories = existingWorker.categories;
    }

    // Update worker data
    const updatedWorker = await updateWorkerById(userId, {
      ...workerData,
      categories, // Update the categories field
      registerImage: registerImageUrl,
      workImages: workImageUrls,
      status: "pending",
    });

    res.status(200).json(updatedWorker);
  } catch (err: any) {
    console.error("Error:", err); // Log detailed error
    res.status(500).json({ message: err.message });
  }
};

const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  // Extract the public ID from the image URL
  const publicId = imageUrl.split("/").pop()?.split(".")[0];
  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
};

export const getWorkerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { wId } = req.params;
  console.log("hello", wId);

  try {
    const worker = await getWorkerByIdService(wId);
    console.log("controller", worker);

    if (worker) {
      res.status(200).json(worker);
    } else {
      res.status(404).json({ message: "Worker not found" });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getWorkerAppointmentsController = async (
  req: any,
  res: Response
): Promise<void> => {
  const workerId = req.workerId;

  console.log(workerId);
  
  try {
    const users = await getWorkerAppointmentsService(workerId as string);
    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res
        .status(404)
        .json({ message: "No appointments found for this worker" });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};