import { Request, Response, NextFunction } from "express";
import {
  addCategory,
  blockUser,
  deleteWorker,
  fetchAllBookings,
  fetchAllReviewsWithDetails,
  fetchDailyRevenue,
  findCategoryByName,
  getAllUsers,
  getAllWorkers,
  getBookingTrends,
  loginUser,
  unblockUser,
  updateCategory,
  updateUserProfile,
  updateWorkerStatus,
} from "../../application/adminService";
import cloudinary from "../../cloudinaryConfig";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { getAllCategories } from "../../infrastructure/userRepository";
import mongoose from "mongoose";
import { deleteReviewById } from "../../infrastructure/adminRepository";
import * as adminService from "../../application/adminService";

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
      cloudinary.uploader
        .upload_stream(
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error) {
              return res
                .status(500)
                .json({ error: "Failed to upload image to Cloudinary" });
            }
            profileImageUrl = result?.secure_url || "";
            console.log("Cloudinary URL:", profileImageUrl); // Add logging
            proceedWithUpdate();
          }
        )
        .end(profileImage);
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
export const blockUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;

    const blockedUser = await blockUser(userId);
    res
      .status(200)
      .json({ message: "User blocked successfully", user: blockedUser });
  } catch (error) {
    next(error);
  }
};

// Unblock a user
export const unblockUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const unblockedUser = await unblockUser(userId);
    res
      .status(200)
      .json({ message: "User unblocked successfully", user: unblockedUser });
  } catch (error) {
    next(error);
  }
};

// Get all workers
export const getAllWorkersController = async (req: Request, res: Response) => {
  try {
    const allWorkers = await getAllWorkers();
    res.status(200).json(allWorkers);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve workers" });
  }
};

// Update worker status
export const updateWorkerStatusController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { status } = req.body;


  if (status !== "approved" && status !== "rejected") {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const updatedWorker = await updateWorkerStatus(id, status);
    res.status(200).json(updatedWorker);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Deletes a specified worker by ID
export const deleteWorkerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workerId = req.params.id;
    await deleteWorker(workerId);
    res.status(200).json({ message: "Worker deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Adds a new category if it does not already exist
export const addCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description } = req.body;

  try {
    const existingCategory = await findCategoryByName(name);
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = await addCategory(name, description);
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

// Retrieves the list of all categories
  export const getCategoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// Updates an existing category by ID
export const editCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, description } = req.body;


  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    const updatedCategory = await updateCategory(id, { name, description });


    if (updatedCategory) {
      res.status(200).json(updatedCategory);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    next(error);
  }
};

// Get all reviews with details
export const getAllReviewsWithDetailsController = async (
  req: Request,
  res: Response
) => {
  try {
    const reviews = await fetchAllReviewsWithDetails();
    console.log(reviews);

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// Delete a review
export const deleteReviewController = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.id;

    const result = await deleteReviewById(reviewId);

    if (result) {
      return res
        .status(200)
        .json({ message: "Review marked as deleted successfully." });
    } else {
      return res.status(404).json({ message: "Review not found." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to mark review as deleted.", error });
  }
};

// Retrieves various counts related to admin statistics
export const getAllCounts = async (req: Request, res: Response) => {
  try {
    const counts = await adminService.getAllCounts();
    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching counts", error });
  }
};

// Retrieves daily revenue data for the admin
export const getBookingTrendsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { startDate, endDate } = req.query;
    const bookingTrends = await getBookingTrends(
      new Date(startDate as string),
      new Date(endDate as string)
    );
    res.status(200).json(bookingTrends);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking trends", error });
  }
};

// Retrieves booking trends over a specified period
export async function getDailyRevenue(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const year = parseInt(req.query.year as string, 10);
    const month = parseInt(req.query.month as string, 10);
    const day = parseInt(req.query.day as string, 10);

    console.log("Year:", year, "Month:", month, "Day:", day); 

    if (
      isNaN(year) ||
      isNaN(month) ||
      isNaN(day) ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      res.status(400).json({ error: "Invalid year, month, or day" });
      return;
    }

    const revenue = await fetchDailyRevenue(year, month, day);
    res.status(200).json({ year, month, day, revenue });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching daily revenue" });
  }
}

// Retrieves all bookings for the admin
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await fetchAllBookings();
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
