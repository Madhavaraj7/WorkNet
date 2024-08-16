import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmailAdmin, updateAdminProfile, findAllUsers, blockUserById, findUserById, unblockUserById} from '../infrastructure/userRepository';
import { User } from '../domain/user';
import { errorHandler } from '../utils/errorHandler'; // Assuming errorHandler is a utility function

// Function to log in an admin user
export const loginUser = async (email: string, password: string): Promise<{ token: string; user: Partial<User> } | null> => {
  const validUser = await findUserByEmailAdmin(email);
  if (!validUser) {
    throw errorHandler(404, 'User not found');
  }

  const validPassword = bcrypt.compareSync(password, validUser.password);
  if (!validPassword) {
    throw errorHandler(401, 'Wrong credentials');
  }

  if (validUser.is_verified !== 1) {
    throw errorHandler(403, 'User is not verified');
  }

  const token = jwt.sign(
    {
      userId: validUser._id,
      isVerified: validUser.is_verified,
      role: validUser.role // Include role in token payload
    },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: '1h' }
  );

  const { password: hashedPassword, ...rest } = validUser;

  return { token, user: rest };
};

// Function to update a user's profile
export const updateUserProfile = async (userId: string, update: Partial<User>) => {
  try {
    console.log('userId:', userId);
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
    throw errorHandler(404, 'User not found');
  }

  if (user.isBlocked) {
    throw errorHandler(400, 'User is already blocked');
  }

  return blockUserById(userId);
};

// Function to unblock a user
export const unblockUser = async (userId: string): Promise<User | null> => {
  const user = await findUserById(userId);
  if (!user) {
    throw errorHandler(404, 'User not found');
  }

  if (!user.isBlocked) {
    throw errorHandler(400, 'User is not blocked');
  }

  return unblockUserById(userId);
};
