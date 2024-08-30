import mongoose, { Document, Schema } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../../infrastructure/userRepository';
import { Worker } from '../../domain/worker'; // Import the Worker model

interface CustomRequest extends Request {
  workerId?: string;
}

const workerRoleMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { userId: string };
    console.log('Decoded token:', decoded); // Debugging line

    // Validate the userId format
    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return res.status(400).json({ error: 'Invalid userId format' });
    }

    // Find the user by ID
    const user = await findUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user's role is 'worker'
    if (user.role !== 'worker') {
      return res.status(403).json({ error: 'Unauthorized: Access restricted to workers only' });
    }

    // Find the worker associated with the userId
    const worker = await Worker.findOne({ userId: decoded.userId });
    if (!worker) {
      return res.status(404).json({ error: 'Worker profile not found' });
    }

    // Set workerId in the request object
    req.workerId = worker._id as unknown as string;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in workerRoleMiddleware:', error);
    return res.status(403).json({ error: 'Failed to authenticate token or retrieve user' });
  }
};

export default workerRoleMiddleware;
