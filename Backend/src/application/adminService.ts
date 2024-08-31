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
import { createCategory, deleteWorkerById, getAllWorkersFromDB } from "../infrastructure/adminRepository";
import { Worker } from "../domain/worker"; 
import { Category, ICategory } from "../domain/category";
import { UserModel } from '../infrastructure/userRepository'; // Adjust the import to point to your User model

import mongoose from "mongoose";
import { sendEmail } from "../utils/sendEamilForApprove";

// Function to log in an admin user
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
export const updateUserProfile = async (
  userId: string,
  update: Partial<User>
) => {
  try {
    console.log("userId:", userId);
    // console.log('update:', update);
    const updatedUser = await updateAdminProfile(userId, update);
    // console.log(updateUser);

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
export const getAllUsers = async (): Promise<User[]> => {
  return findAllUsers();
};

// Function to block a user
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
export const getAllWorkers = async () => {
  return await getAllWorkersFromDB();
};

// Function to Update all workers status
export const updateWorkerStatus = async (
  _id: string,
  status: "approved" | "rejected"
) => {
  try {
    // Find the worker by _id
    const worker = await Worker.findOne({ _id });
    console.log("worker", worker);

    // If worker is not found, throw an error
    if (!worker) {
      throw new Error("Worker not found");
    }

    // Update the worker's status
    const updatedWorker = await Worker.findOneAndUpdate(
      { _id },
      { status },
      { new: true }
    );

    // Fetch the associated user by worker.userId
    const user = await UserModel.findOne({ _id: worker.userId });

    if (!user) {
      throw new Error("User not found");
    }

    // If the status is approved, update the user's role to "worker"
    if (status === "approved") {
      await UserModel.findOneAndUpdate(
        { _id: worker.userId }, 
        { role: "worker" },
        { new: true }
      );
    }

    // Send email notification based on the status
    const emailSubject = status === "approved" ? "Worker Status Approved" : "Worker Status Rejected";
    const emailBody = status === "approved"
      ? "Congratulations! Your worker status has been approved please login again."
      : "We regret to inform you that your worker status has been rejected.";

    await sendEmail ({
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

export const deleteWorker = async (workerId: string) => {
  const worker = await Worker.findById(workerId);
  if (!worker) {
    throw errorHandler(404, 'Worker not found');
  }

  worker.isBlocked = true;
  await worker.save();

  const userId = worker.userId; 
  const user = await UserModel.findById(userId);
  if (!user) {
    throw errorHandler(404, 'User not found');
  }

  user.isBlocked = true;
  await user.save();

  return await deleteWorkerById(workerId);
};


// Function to add a new category
export const addCategory = async (name: string, description?: string) => {
  const newCategory = await createCategory({ name, description });
  return newCategory;
};

export const updateCategory = async (
  _id: string,
  updateData: Partial<ICategory>
) => {
  // Validate the _id
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new Error('Invalid category ID');
  }

  try {
    // Find and update the category
    const updatedCategory = await Category.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true, // Ensure validators are run during the update
    });

    console.log(updateCategory);
    

    if (!updatedCategory) {
      throw new Error('Category not found');
    }

    return updatedCategory;
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }
};

export const findCategoryByName = async (name: string) => {
  return Category.findOne({ name });
};