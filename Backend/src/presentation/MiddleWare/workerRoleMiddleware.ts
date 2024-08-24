import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../../infrastructure/userRepository'; // Import the repository function

interface CustomRequest extends Request {
    userId?: string;
}

const workerRoleMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { userId: string };
        req.userId = decoded.userId;

        // Find the user by ID
        const user = await findUserById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user's role is 'worker'
        if (user.role !== 'worker') {
            return res.status(403).json({ error: 'Unauthorized: Access restricted to workers only' });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error in workerRoleMiddleware:', error);
        return res.status(403).json({ error: 'Failed to authenticate token or retrieve user' });
    }
};

export default workerRoleMiddleware;
