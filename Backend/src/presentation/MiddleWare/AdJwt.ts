import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
    userId?: string;
    isVerified?: number; // `isVerified` is either 0 or 1
}

const adminJwtMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { userId: string; isVerified: number };
        req.userId = decoded.userId;
        req.isVerified = decoded.isVerified;

        // Check if the user is an admin
        if (req.isVerified !== 1) {
            return res.status(403).json({ error: 'User is not an admin' });
        }

        next();
    } catch (error) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
};

export default adminJwtMiddleware;
