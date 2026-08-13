import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../utils/AppError';


type RequestParams = 'query' | 'body' | 'params';

export const validate = (schema: ZodType, part: RequestParams = 'body') => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[part]);

        if(!result.success) {
            const first = result.error.issues[0];
            const message = first ? `${first.path.join('.')}: ${first.message}` : 'Validation failed';
            return next(new AppError(message, 400, 'VALIDATION_ERROR'));
        }

        (req as Request & { validated: unknown }).validated = result.data;
        next();
    }
}