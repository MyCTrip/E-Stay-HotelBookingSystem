import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import { merchantCreateSchema, merchantUpdateSchema } from './merchant.schema';
import {
  getProfile,
  upsertProfile,
  submitProfile,
  getMerchantNotifications,
  markMerchantNotificationAsRead,
} from './merchant.controller';

const router = Router();

router.get('/', authenticate, getProfile);
router.post('/', authenticate, validateBody(merchantCreateSchema), upsertProfile);
router.put('/', authenticate, validateBody(merchantUpdateSchema), upsertProfile);
router.post('/submit', authenticate, submitProfile);

// 通知相关路由
router.get('/notifications', authenticate, getMerchantNotifications);
router.patch('/notifications/:id/read', authenticate, markMerchantNotificationAsRead);

export default router;
