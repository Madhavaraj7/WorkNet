import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
    userId?: string;
}

const jwtMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log(token);
    

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        console.log("hello");
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        // console.log(decoded);
        
        req.userId = (decoded as { userId: string }).userId;  
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
};

export default jwtMiddleware;
