import mongoose, { Schema, Document } from "mongoose";
import { User } from "../domain/user";

interface UserModel extends User, Document {}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, required: true },
  otp: { type: String },
  otpVerified: { type: Boolean, default: false },
});

const UserModel = mongoose.model<UserModel>("User", UserSchema);

export const createUser = async (user: User) => {
  const newUser = new UserModel(user);
  return newUser.save();
};

export const findUserByEmail = async (email: string) => {
  return UserModel.findOne({ email });
};

export const updateUser = async (email: string, update: Partial<User>) => {
  return UserModel.findOneAndUpdate({ email }, update, { new: true });
};

export const findUserByEmailAndPassword = async (
  email: string,
  password: string
) => {
  return UserModel.findOne({ email, password });
};
