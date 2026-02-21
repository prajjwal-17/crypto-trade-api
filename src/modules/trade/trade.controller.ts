import { Request, Response, NextFunction } from 'express';
import {
  createSignal,
  getMySignals,
  getAllSignals,
  updateSignal,
  deleteSignal,
} from './trade.service';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;

    const signal = await createSignal(user.userId, req.body);

    res.status(201).json({
      success: true,
      data: signal,
    });
  } catch (error) {
    next(error);
  }
};

export const getMine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;

    const signals = await getMySignals(user.userId);

    res.json({
      success: true,
      data: signals,
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signals = await getAllSignals();

    res.json({
      success: true,
      data: signals,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const id = req.params.id as string;

    const updated = await updateSignal(id, user.userId, user.role, req.body);

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const id = req.params.id as string;
    await deleteSignal(id, user.userId, user.role);

    res.json({
      success: true,
      message: 'Signal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};