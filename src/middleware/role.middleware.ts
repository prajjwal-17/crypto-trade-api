import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(new AppError('Forbidden: Access denied', 403));
    }

    next();
  };
};