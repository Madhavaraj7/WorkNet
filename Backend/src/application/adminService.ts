import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmailAdmin } from '../infrastructure/userRepository';
import { User } from '../domain/user';
import { errorHandler } from '../utils/errorHandler'; // Assuming errorHandler is a utility function

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

  const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
  const { password: hashedPassword, ...rest } = validUser;

  return { token, user: rest };
};