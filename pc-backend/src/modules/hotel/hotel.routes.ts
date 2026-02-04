import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import {
  createHotel,
  updateHotel,
  submitHotel,
  listApprovedHotels,
  listMyHotels,
} from './hotel.controller';
import { createHotelSchema, updateHotelSchema } from './hotel.schema';
import { requireMerchantVerified } from '../../middlewares/merchant.middleware';

const router = Router();

// 创建酒店仅允许商户且必须为已通过商户
router.post(
  '/',
  authenticate,
  requireRole('merchant'),
  requireMerchantVerified,
  validateBody(createHotelSchema),
  createHotel
);
// 商户获取自己创建的酒店列表
router.get('/my', authenticate, requireRole('merchant'), requireMerchantVerified, listMyHotels);
// 更新允许商户更新自身或管理员更新审核信息（控制逻辑在 controller）
router.put('/:id', authenticate, validateBody(updateHotelSchema), updateHotel);
// 提交审核仅允许商户且商户必须已通过
router.post(
  '/:id/submit',
  authenticate,
  requireRole('merchant'),
  requireMerchantVerified,
  submitHotel
);
router.get('/', listApprovedHotels);

export default router;
