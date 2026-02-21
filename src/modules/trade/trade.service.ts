import { prisma } from '../../config/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../../middleware/error.middleware';

export const createSignal = async (userId: string, data: any) => {
  return prisma.tradeSignal.create({
    data: {
      asset: data.asset,
      direction: data.direction,
      entryPrice: new Prisma.Decimal(data.entryPrice),
      targetPrice: new Prisma.Decimal(data.targetPrice),
      stopLoss: new Prisma.Decimal(data.stopLoss),
      userId,
    },
  });
};

export const getMySignals = async (userId: string) => {
  return prisma.tradeSignal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getAllSignals = async () => {
  return prisma.tradeSignal.findMany({
    orderBy: { createdAt: 'desc' },
  });
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

  return prisma.tradeSignal.update({
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

  return prisma.tradeSignal.delete({
    where: { id: signalId },
  });
};