import { z } from 'zod';

export const createSignalSchema = z.object({
  asset: z.string().min(1, 'Asset is required'),
  direction: z.enum(['LONG', 'SHORT']),
  entryPrice: z.string().regex(/^\d+(\.\d+)?$/, 'Invalid entry price'),
  targetPrice: z.string().regex(/^\d+(\.\d+)?$/, 'Invalid target price'),
  stopLoss: z.string().regex(/^\d+(\.\d+)?$/, 'Invalid stop loss'),
});

export const updateSignalSchema = z.object({
  asset: z.string().min(1).optional(),
  direction: z.enum(['LONG', 'SHORT']).optional(),
  entryPrice: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  targetPrice: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  stopLoss: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  status: z.enum(['OPEN', 'CLOSED']).optional(),
});