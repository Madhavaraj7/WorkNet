import { Request, Response, NextFunction } from "express";
import {
  blockUser,
  deleteWorker,
  getAllUsers,
  getAllWorkers,
  loginUser,
  unblockUser,
  updateUserProfile,
  updateWorkerStatus,
} from "../../application/adminService";
import cloudinary from "../../cloudinaryConfig";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

interface CustomRequest extends Request {
  userId?: string;
  role?: string;
}

// Admin login function
export const adminlogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const result = await loginUser(email, password);
    if (result) {
      res.json({ token: result.token, user: result.user });
    } else {
      res.status(401).json({ message: "Login failed" });
    }
  } catch (error) {
    next(error);
  }
};

// Update admin profile
export const adminupdateProfile = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { username, email } = req.body;
    const profileImage = req.file ? req.file.buffer : null;
    let profileImageUrl = "";

    const proceedWithUpdate = async () => {
      try {
        const updatedUser = await updateUserProfile(userId, {
          username,
          email,
          profileImage: profileImageUrl || undefined,
        });

        res.status(200).json(updatedUser);
      } catch (error: any) {
        res
          .status(400)
          .json({ error: "Failed to update profile: " + error.message });
      }
    };

    if (profileImage) {
      // Upload the image to Cloudinary
      cloudinary.uploader.upload_stream(
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            return res
              .status(500)
              .json({ error: "Failed to upload image to Cloudinary" });
          }
          profileImageUrl = result?.secure_url || "";
          proceedWithUpdate();
        }
      ).end(profileImage);
    } else {
      proceedWithUpdate(); // No image provided, proceed with updating other fields
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Failed to update profile: " + error.message });
  }
};

// Get all users
export const getUsersList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};


// Block a user
export const blockUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    console.log("backend", userId);
    
    const blockedUser = await blockUser(userId);
    res.status(200).json({ message: "User blocked successfully", user: blockedUser });
  } catch (error) {
    next(error);
  }
};

// Unblock a user
export const unblockUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const unblockedUser = await unblockUser(userId);
    res.status(200).json({ message: "User unblocked successfully", user: unblockedUser });
  } catch (error) {
    next(error);
  }
};


export const getAllWorkersController = async (req: Request, res: Response) => {
  try {
    const allWorkers = await getAllWorkers();
    res.status(200).json(allWorkers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve workers' });
  }
};

export const updateWorkerStatusController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log("status in backend",status);
  console.log("status in id",id);

  

  if (status !== 'approved' && status !== 'rejected') {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const updatedWorker = await updateWorkerStatus(id, status);
    res.status(200).json(updatedWorker);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteWorkerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workerId = req.params.id;
    await deleteWorker(workerId);
    res.status(200).json({ message: 'Worker deleted successfully' });
  } catch (error) {
    next(error);
  }
};