import mongoose, { Schema, Document } from "mongoose";
import { User } from "../domain/user";
import { Category } from "../domain/category";

interface UserModel extends User, Document {
  otp?: string;
  otpVerified?: boolean;
}

const UserSchema: Schema<UserModel> = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, required: true },
  otp: { type: String },
  otpVerified: { type: Boolean, default: false },
  is_verified: {
    type: Number,
    default: 0,
  },
  isBlocked: { type: Boolean, default: false }, 
  role: { type: String, default: 'user' } 



});

export const UserModel = mongoose.model<UserModel>("User", UserSchema);




// Function to create a new user
export const createUser = async (user: User) => {
  const newUser = new UserModel(user);
  return newUser.save();
};

// Function to find a user by email
export const findUserByEmail = async (email: string) => {
  return UserModel.findOne({ email });
};

// Function to update a user by email
export const updateUser = async (email: string, update: Partial<User>) => {
  return UserModel.findOneAndUpdate({ email }, update, { new: true });
};

// Function to find a user by email and password
export const findUserByEmailAndPassword = async (
  email: string,
  password: string
) => {
  return UserModel.findOne({ email, password });
};

// Function to update the user's profile by user ID
export const updateUserProfile = async (userId: string, update: Partial<User>) => {
  return UserModel.findByIdAndUpdate(userId, update, { new: true });
};


export const findUserByEmailAdmin = async (email: string): Promise<User | null> => {
  const user = await UserModel.findOne({ email });
  return user ? user.toObject() : null;
};

export const updateAdminProfile = async (userId: string, update: Partial<User>) => {
  return UserModel.findByIdAndUpdate(userId, update, { new: true });
};

// Function to find a user by ID
export const findUserById = async (userId: string) => {
  return UserModel.findById(userId);
};


// Fetch all users
export const findAllUsers = async (): Promise<User[]> => {
  return UserModel.find(); 
};



// Function to block a user by ID
export const blockUserById = async (userId: string) => {
  return UserModel.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
};

// Function to unblock a user by ID
export const unblockUserById = async (userId: string) => {
  return UserModel.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
};



export const getAllCategories = async () => {
  return Category.find();
};


