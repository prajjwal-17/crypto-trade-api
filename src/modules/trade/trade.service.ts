import { prisma } from '../../config/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../../middleware/error.middleware';
import redis from '../../config/redis';


export const createSignal = async (userId: string, data: any) => {
  const signal = await prisma.tradeSignal.create({
    data: {
      asset: data.asset,
      direction: data.direction,
      entryPrice: new Prisma.Decimal(data.entryPrice),
      targetPrice: new Prisma.Decimal(data.targetPrice),
      stopLoss: new Prisma.Decimal(data.stopLoss),
      userId,
    },
  });

  //  Invalidate cache safely
  try {
    await redis.del(`signals:user:${userId}`);
    await redis.del(`signals:admin:all`);
  } catch (err) {
    console.error('Redis cache invalidation failed');
  }

  return signal;
};


export const getMySignals = async (userId: string) => {
  const cacheKey = `signals:user:${userId}`;

  //  Try Redis read
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('Serving user signals from cache');
      return JSON.parse(cached);
    }
  } catch (err) {
    console.error('Redis read failed, falling back to DB');
  }

  //  Always fallback to DB
  const signals = await prisma.tradeSignal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  //  Try caching result (non-blocking if fails)
  try {
    await redis.set(cacheKey, JSON.stringify(signals), 'EX', 60);
  } catch (err) {
    console.error('Redis write failed');
  }

  return signals;
};


export const getAllSignals = async () => {
  const cacheKey = `signals:admin:all`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('Serving admin signals from cache');
      return JSON.parse(cached);
    }
  } catch (err) {
    console.error('Redis read failed, falling back to DB');
  }

  const signals = await prisma.tradeSignal.findMany({
    orderBy: { createdAt: 'desc' },
  });

  try {
    await redis.set(cacheKey, JSON.stringify(signals), 'EX', 60);
  } catch (err) {
    console.error('Redis write failed');
  }

  return signals;
};


export const updateSignal = async (
  signalId: string,
  userId: string,
  role: string,
  data: any
) => {
  const existing = await prisma.tradeSignal.findUnique({
    where: { id: signalId },
  });

  if (!existing) {
    throw new AppError('Signal not found', 404);
  }

  if (role !== 'ADMIN' && existing.userId !== userId) {
    throw new AppError('Forbidden: Not owner', 403);
  }

  const updatedSignal = await prisma.tradeSignal.update({
    where: { id: signalId },
    data: {
      ...(data.asset && { asset: data.asset }),
      ...(data.direction && { direction: data.direction }),
      ...(data.entryPrice && {
        entryPrice: new Prisma.Decimal(data.entryPrice),
      }),
      ...(data.targetPrice && {
        targetPrice: new Prisma.Decimal(data.targetPrice),
      }),
      ...(data.stopLoss && {
        stopLoss: new Prisma.Decimal(data.stopLoss),
      }),
      ...(data.status && { status: data.status }),
    },
  });

  //  Safe cache invalidation
  try {
    await redis.del(`signals:user:${existing.userId}`);
    await redis.del(`signals:admin:all`);
  } catch (err) {
    console.error('Redis invalidation failed');
  }

  return updatedSignal;
};


export const deleteSignal = async (
  signalId: string,
  userId: string,
  role: string
) => {
  const existing = await prisma.tradeSignal.findUnique({
    where: { id: signalId },
  });

  if (!existing) {
    throw new AppError('Signal not found', 404);
  }

  if (role !== 'ADMIN' && existing.userId !== userId) {
    throw new AppError('Forbidden: Not owner', 403);
  }

  const deletedSignal = await prisma.tradeSignal.delete({
    where: { id: signalId },
  });

  //  Safe cache invalidation
  try {
    await redis.del(`signals:user:${existing.userId}`);
    await redis.del(`signals:admin:all`);
  } catch (err) {
    console.error('Redis invalidation failed');
  }

  return deletedSignal;
};