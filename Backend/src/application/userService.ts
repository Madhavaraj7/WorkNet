import bcrypt from 'bcrypt';
import { createUser, findUserByEmail, updateUser } from '../infrastructure/userRepository';
import { User } from '../domain/user';

export const registerUser = async (user: User) => {
    const existingUser = await findUserByEmail(user.email);
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    return createUser(user);
};

export const verifyAndSaveUser = async (email: string, otp: string) => {
    const user = await findUserByEmail(email);
    if (user && user.otp === otp) {
        user.otp = undefined;
        return user.save();
    }
    throw new Error('Invalid OTP');
};

export const updateUserOtp = async (email: string, otp: string) => {
    return updateUser(email, { otp });
};
