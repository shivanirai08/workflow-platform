import { verifyAccessToken } from '../utils/token.utils';
import type { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request & { user?: { id: string } }, res : Response, next : NextFunction) => {
    const header = req.headers.authorization;

    if(!header){
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    const token = header.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      try {
        const decoded = verifyAccessToken(token) as { userId: string };
        req.user = { id: decoded.userId };
        next();
      } 
      catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
};