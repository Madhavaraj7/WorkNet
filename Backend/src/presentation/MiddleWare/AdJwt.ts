import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
    userId?: string;
    role?: string; 
}

const adminJwtMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
console.log("kdsanfkj");
console.log(token);


    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        console.log("try");
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { userId: string; role: string };
        req.userId = decoded.userId;
        req.role = decoded.role;

        console.log(decoded);
        

        if (req.role !== 'admin') {
            return res.status(403).json({ error: 'User is not an admin' });
        }

        next();
    } catch (error) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
};

export default adminJwtMiddleware;
