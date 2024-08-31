import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  getAllCategories,
  updateUser,
} from "../infrastructure/userRepository";
import { updateUserProfile as updateUserProfileRepo } from "../infrastructure/userRepository";
import { sendEmail } from "../utils/sendEmail";
import { User } from "../domain/user";
import { otpGenerator } from "../utils/otpGenerator"; // Make sure this function generates OTPs
import { Slot } from "../domain/slot";
import { Booking } from "../domain/booking";



// registerUser new User
export const registerUser = async (user: User) => {
  try {
    const existingUser = await findUserByEmail(user.email);
    // console.log(existingUser);

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

export const updateUserOtp = async (email: string, otp: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  return updateUser(email, { otp });
};

// login the user
export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid Email/Password");
  }
  if (user.isBlocked) {
    throw new Error('User is blocked');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid Email/Password");
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1h",
  });
  return { user, token };
};


export const updateUserProfile = async (userId: string, update: Partial<User>) => {
    try {
        console.log('userId:', userId);
        // console.log('update:', update);
        const updatedUser = await updateUserProfileRepo(userId, update);
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


export const forgotPassword = async (email: string) => {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const otp = otpGenerator(); // Generate an OTP
    await updateUser(email, { otp }); // Store the OTP in the user's record

    await sendEmail(email, otp, "Your OTP for password reset is:"); // Send OTP email
    
    return { message: "OTP sent to your email" };
  } catch (error) {
    console.error("Error during password reset request:", error);
    throw new Error("Failed to send OTP");
  }
};


// Function to handle password reset
export const resetPassword = async (email: string, otp: string, newPassword: string) => {
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

export const fetchAllCategories = async () => {
  return getAllCategories();
};



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
      throw new Error('Error retrieving available slots');
  }
};


export const getUserBookedWorkers = async (userId: string) => {
  return Booking.find({ userId })
    .populate({
      path: 'workerId',
      select: 'name phoneNumber whatsappNumber registerImage', 
    })
    .exec();
};