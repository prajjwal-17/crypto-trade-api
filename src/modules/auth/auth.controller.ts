import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from './auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};