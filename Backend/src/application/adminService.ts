import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmailAdmin,
  updateAdminProfile,
  findAllUsers,
  blockUserById,
  findUserById,
  unblockUserById,
} from "../infrastructure/userRepository";
import { User } from "../domain/user";
import { errorHandler } from "../utils/errorHandler";
import {
  createCategory,
  deleteWorkerById,
  getAllBookingsWithDetails,
  getAllWorkersFromDB,
} from "../infrastructure/adminRepository";
import { Worker } from "../domain/worker";
import { Category, ICategory } from "../domain/category";
import { UserModel } from "../infrastructure/userRepository";
import * as adminRepository from "../infrastructure/adminRepository";

import mongoose from "mongoose";
import { sendEmail } from "../utils/sendEamilForApprove";
import { getAllReviewsWithDetails } from "../infrastructure/reviewRepository";
import { deleteReviewById as deleteReviewInRepo } from "../infrastructure/adminRepository";
import { Booking } from "../domain/booking";





// Function to log in an admin user
// Verifies credentials, checks if user is verified, and generates JWT token
export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string; user: Partial<User> } | null> => {
  const validUser = await findUserByEmailAdmin(email);
  if (!validUser) {
    throw errorHandler(404, "User not found");
  }

  const validPassword = bcrypt.compareSync(password, validUser.password);
  if (!validPassword) {
    throw errorHandler(401, "Wrong credentials");
  }

  if (validUser.is_verified !== 1) {
    throw errorHandler(403, "User is not verified");
  }

  const token = jwt.sign(
    {
      userId: validUser._id,
      isVerified: validUser.is_verified,
      role: validUser.role, // Include role in token payload
    },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: "1h" }
  );

  const { password: hashedPassword, ...rest } = validUser;

  return { token, user: rest };
};

// Function to update a user's profile
// Updates profile information for an admin user
export const updateUserProfile = async (
  userId: string,
  update: Partial<User>
) => {
  try {
    const updatedUser = await updateAdminProfile(userId, update);

    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
};

// Fetch all users
// Retrieves all users from the database
export const getAllUsers = async (): Promise<User[]> => {
  return findAllUsers();
};


// Function to block a user
// Marks a user as blocked in the database
export const blockUser = async (userId: string): Promise<User | null> => {
  const user = await findUserById(userId);
  if (!user) {
    throw errorHandler(404, "User not found");
  }

  if (user.isBlocked) {
    throw errorHandler(400, "User is already blocked");
  }

  return blockUserById(userId);
};

// Function to unblock a user
// Marks a user as unblocked in the database
export const unblockUser = async (userId: string): Promise<User | null> => {
  const user = await findUserById(userId);
  if (!user) {
    throw errorHandler(404, "User not found");
  }

  if (!user.isBlocked) {
    throw errorHandler(400, "User is not blocked");
  }

  return unblockUserById(userId);
};

// Function to Get all workers
// Retrieves all workers from the database
export const getAllWorkers = async () => {
  return await getAllWorkersFromDB();
};

// Function to update worker status
// Approves or rejects a worker's application and sends a notification email
export const updateWorkerStatus = async (
  _id: string,
  status: "approved" | "rejected"
) => {
  try {
    const worker = await Worker.findOne({ _id });
    console.log("worker", worker);

    if (!worker) {
      throw new Error("Worker not found");
    }

    const updatedWorker = await Worker.findOneAndUpdate(
      { _id },
      { status },
      { new: true }
    );

    const user = await UserModel.findOne({ _id: worker.userId });

    if (!user) {
      throw new Error("User not found");
    }

    if (status === "approved") {
      await UserModel.findOneAndUpdate(
        { _id: worker.userId },
        { role: "worker" },
        { new: true }
      );
    }

    const emailSubject =
      status === "approved"
        ? "Worker Status Approved"
        : "Worker Status Rejected";
    const emailBody =
      status === "approved"
        ? "Congratulations! Your worker status has been approved please login again."
        : "We regret to inform you that your worker status has been rejected.";

    await sendEmail({
      to: user.email,
      subject: emailSubject,
      body: emailBody,
    });

    return updatedWorker;
  } catch (error: any) {
    console.error(`Failed to update worker status: ${error.message}`);
    throw new Error(`Failed to update worker status: ${error.message}`);
  }
};

// Function to delete a worker
// Blocks a worker and marks their user account as blocked in the database
export const deleteWorker = async (workerId: string) => {
  const worker = await Worker.findById(workerId);
  if (!worker) {
    throw errorHandler(404, "Worker not found");
  }

  worker.isBlocked = true;
  await worker.save();

  const userId = worker.userId;
  const user = await UserModel.findById(userId);
  if (!user) {
    throw errorHandler(404, "User not found");
  }

  user.isBlocked = true;
  await user.save();

  return await deleteWorkerById(workerId);
};

// Function to add a new category
// Creates a new category in the system
export const addCategory = async (name: string, description?: string) => {
  const newCategory = await createCategory({ name, description });
  return newCategory;
};

// Function to update a category
// Updates details of an existing category by its ID
export const updateCategory = async (
  _id: string,
  updateData: Partial<ICategory>
) => {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new Error("Invalid category ID");
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      throw new Error("Category not found");
    }

    return updatedCategory;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};

// Function to find a category by name
// Searches for a category by its name
export const findCategoryByName = async (name: string) => {
  return Category.findOne({ name });
};


// Function to fetch all reviews with details
// Retrieves all reviews along with additional details
export const fetchAllReviewsWithDetails = async () => {
  return await getAllReviewsWithDetails();
};


// Function to get counts of users, workers, bookings, and reviews
// Fetches the count of various entities in the system
export const getAllCounts = async (): Promise<{
  usersCount: number;
  workersCount: number;
  bookingsCount: number;
  reviewCount: number;
}> => {
  const usersCount = await adminRepository.getUsersCount();
  const workersCount = await adminRepository.getWorkersCount();
  const bookingsCount = await adminRepository.getBookingsCount();
  const reviewCount = await adminRepository.getReviewCount();
  return { usersCount, workersCount, bookingsCount, reviewCount };
};


// Function to get booking trends
// Fetches the count of bookings between two dates, grouped by day
export const getBookingTrends = async (
  startDate: Date,
  endDate: Date
): Promise<{ date: string; count: number }[]> => {
  const bookings = await Booking.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return bookings.map((booking) => ({
    date: booking._id,
    count: booking.count,
  }));
};


// Function to fetch daily revenue
// Retrieves total revenue for a specific day
export async function fetchDailyRevenue(
  year: number,
  month: number,
  day: number
): Promise<number> {
  const startDate = new Date(year, month - 1, day, 0, 0, 0); 
  const endDate = new Date(year, month - 1, day + 1, 0, 0, 0); 

  const result = await Booking.aggregate([
    {
      $match: {
        status: "Confirmed",
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalRevenue : 0;
}

// Function to fetch daily revenue
// Retrieves total revenue for a specific day
export const fetchAllBookings = async () => {
  try {
    const bookings = await getAllBookingsWithDetails();
    return bookings;
  } catch (error: any) {
    throw new Error(`Error fetching bookings: ${error.message}`);
  }
};


// Function to delete a review
// Deletes a review from the database by its ID
export const deleteReviewById = async (reviewId: string): Promise<void> => {
  await deleteReviewInRepo(reviewId);
};