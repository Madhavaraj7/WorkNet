import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  findUserById,
  getAllCategories,
  updateUser,
} from "../infrastructure/userRepository";
import { updateUserProfile as updateUserProfileRepo } from "../infrastructure/userRepository";
import { sendEmail } from "../utils/sendEmail";
import { User } from "../domain/user";
import { otpGenerator } from "../utils/otpGenerator"; 
import { Slot } from "../domain/slot";
import { Booking } from "../domain/booking";

// registerUser new User
export const registerUser = async (user: User) => {
  try {
    const existingUser = await findUserByEmail(user.email);

    if (existingUser) {
      if (existingUser.otpVerified) {
        throw new Error("User already exists");
      } else {
        await updateUser(existingUser.email, user);
        return existingUser;
      }
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    return await createUser(user);
  } catch (error) {
    console.error("Error during user registration:", error);

    throw error;
  }
};

// Function to handle Google login
export const googleLogin = async ({
  email,
  profileImagePath,
  username,
}: {
  email: string;
  profileImagePath?: string;
  username: string;
}) => {
  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      const token = jwt.sign(
        { userId: existingUser._id },
        process.env.JWT_SECRET_KEY!,
        { expiresIn: "1h" }
      );
      return { user: existingUser, token };
    } else {
      const newUser: User = {
        username,
        email,
        password: "defaultPassword",
        profileImage: profileImagePath || "",
        otpVerified: true,
        is_verified: 0,
        role: "user",
      };

      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      newUser.password = hashedPassword;

      const createdUser = await createUser(newUser);
      const token = jwt.sign(
        { userId: createdUser._id },
        process.env.JWT_SECRET_KEY!,
        { expiresIn: "1h" }
      );
      return { user: createdUser, token };
    }
  } catch (error) {
    console.error("Error during Google login:", error);
    throw new Error("Failed to handle Google login");
  }
};


// Verify OTP and save the user
export const verifyAndSaveUser = async (email: string, otp: string) => {
  const user = await findUserByEmail(email);
  if (user && user.otp === otp) {
    user.otp = undefined;
    user.otpVerified = true;
    await user.save();
    return user;
  }
  throw new Error("Invalid OTP");
};

// Update user OTP
export const updateUserOtp = async (email: string, otp: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  return updateUser(email, { otp });
};



// login the user
const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY!, { expiresIn: "1h" });
};

// Refresh the access token using a refresh token
const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET_KEY!, { expiresIn: "7d" });
};

// Login the user
export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid Email/Password");
  }

  if (user.isBlocked) {
    throw new Error("User is blocked");
  }

  if (!user.otpVerified) {
    throw new Error("OTP verification required");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid Email/Password");
  }

  // Generate JWT access and refresh tokens
  const accessToken = generateAccessToken(user._id as string);
  const refreshToken = generateRefreshToken(user._id as string);

  // Return user and tokens
  return { user, accessToken, refreshToken };
};

// Refresh the access token using a refresh token
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY!);
    const userId = (decoded as any).userId;

    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newAccessToken = generateAccessToken(userId);

    return { accessToken: newAccessToken };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};


// Update user profile
export const updateUserProfile = async (
  userId: string,
  update: Partial<User>
) => {
  try {
    
    const updatedUser = await updateUserProfileRepo(userId, update);

    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
};

// Handle forgot password
export const forgotPassword = async (email: string) => {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const otp = otpGenerator(); 
    await updateUser(email, { otp }); 

    await sendEmail(email, otp, "Your OTP for password reset is:"); 

    return { message: "OTP sent to your email" };
  } catch (error) {
    console.error("Error during password reset request:", error);
    throw new Error("Failed to send OTP");
  }
};

// Function to handle password reset
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  try {
    const user = await findUserByEmail(email);

    if (!user || user.otp !== otp) {
      throw new Error("Invalid OTP or user not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    await user.save();

    return { message: "Password has been reset successfully" };
  } catch (error) {
    console.error("Error during password reset:", error);
    throw new Error("Failed to reset password");
  }
};

// Fetch all categories
export const fetchAllCategories = async () => {
  return getAllCategories();
};

// Get available slots by worker ID
export const getSlotsByWorkerIdService = async (workerId: string) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const slots = await Slot.find({
      workerId,
      isAvailable: true,
      date: { $gte: today },
    }).exec();

    return slots;
  } catch (error) {
    throw new Error("Error retrieving available slots");
  }
};

// Get confirmed bookings for a user
export const getUserBookedWorkers = async (userId: string) => {
  return Booking.find({ userId, status: "Confirmed" })
    .populate({
      path: "workerId",
      select: "name phoneNumber whatsappNumber registerImage",
    })
    .populate({
      path: "slotId",
      select: "date", 
    })
    .sort({ createdAt: -1 }) 
    .exec();
};

