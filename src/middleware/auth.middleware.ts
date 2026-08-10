import { verifyAccessToken } from '../utils/token.utils';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const authenticate = (
  req: Request & { user?: { id: string } },
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
  }

  const token = header.split(' ')[1];

  if (!token) {
    return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
  }

  try {
    const decoded = verifyAccessToken(token) as { userId: string };
    req.user = { id: decoded.userId };
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401, 'INVALID_ACCESS_TOKEN'));
  }
};
