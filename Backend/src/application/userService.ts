import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, updateUser } from '../infrastructure/userRepository';
import { User } from '../domain/user';

export const registerUser = async (user: User) => {
    const existingUser = await findUserByEmail(user.email);
    if (existingUser) {
        if (existingUser.otpVerified) {
            throw new Error('User already exists');
        } else {
            await updateUser(user.email, user);
            return existingUser;
        }
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    return createUser(user);
};

// Function to handle Google login
export const googleLogin = async ({
    email,
    profileImagePath, // New parameter to accept the path of the stored image
    username,
  }: {
    email: string;
    profileImagePath?: string;
    username: string;
  }) => {
    const existingUser = await findUserByEmail(email);
  
    if (existingUser) {
      const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
      return { user: existingUser, token };
    } else {
      const newUser: User = {
        username,
        email,
        password: 'defaultPassword',
        profileImage: profileImagePath || '',
      };
  
      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      newUser.password = hashedPassword;
  
      const createdUser = await createUser(newUser);
      const token = jwt.sign({ userId: createdUser._id }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
      return { user: createdUser, token };
    }
  };
  

export const verifyAndSaveUser = async (email: string, otp: string) => {
    const user = await findUserByEmail(email);
    if (user && user.otp === otp) {
        user.otp = undefined;
        user.otpVerified = true;
        return user.save();
    }
    throw new Error('Invalid OTP');
};

export const updateUserOtp = async (email: string, otp: string) => {
    return updateUser(email, { otp });
};

export const loginUser = async (email: string, password: string) => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error('Invalid Email/Password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid Email/Password');
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
    return { user, token };
};
