import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  create,
  getMine,
  getAll,
  update,
  remove,
} from './trade.controller';
import {
  createSignalSchema,
  updateSignalSchema,
} from './trade.schema';

const router = Router();

router.post(
  '/',
  authenticate,
  validate(createSignalSchema),
  create
);

router.get(
  '/mine',
  authenticate,
  getMine
);

router.get(
  '/',
  authenticate,
  authorize(['ADMIN']),
  getAll
);

router.put(
  '/:id',
  authenticate,
  validate(updateSignalSchema),
  update
);

router.delete(
  '/:id',
  authenticate,
  remove
);

export default router;