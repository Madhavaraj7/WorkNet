import { Request, Response, NextFunction } from 'express';
import { findUserById } from '../../infrastructure/userRepository';

interface CustomRequest extends Request {
  userId?: string;
}

const checkUserStatusMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await findUserById(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isBlocked) {
            return res.status(403).json({ error: 'Your account is blocked. Please contact support.' });
        }

        next(); 
    } catch (error) {
        console.error('Error in checkUserStatusMiddleware:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

export default checkUserStatusMiddleware;
