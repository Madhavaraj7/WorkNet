import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../../infrastructure/userRepository'; // Import the repository function

interface CustomRequest extends Request {
    userId?: string;
}

const jwtMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { userId: string };
        req.userId = decoded.userId;

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
};

export default jwtMiddleware;
