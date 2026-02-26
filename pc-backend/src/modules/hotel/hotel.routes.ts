import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import { cache } from '../../middlewares/cache.middleware';
import {
  createHotel,
  updateHotel,
  submitHotel,
  listApprovedHotels,
  listMyHotels,
  requestDeleteHotel,
  getHotHotels,
  getCities,
  getDetail,
  getHotelRooms,
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

// 商户发起删除请求（不立即物理删除）
router.post(
  '/:id/delete-request',
  authenticate,
  requireRole('merchant'),
  requireMerchantVerified,
  requestDeleteHotel
);
// 获取已审核通过的酒店列表（支持分页和筛选）
router.get('/', cache({ expiration: 300, keyPrefix: 'hotel:' }), listApprovedHotels);

// 获取热门酒店
router.get('/hot', cache({ expiration: 3600, keyPrefix: 'hotel:' }), getHotHotels);

// 获取城市列表
router.get('/cities', cache({ expiration: 86400, keyPrefix: 'hotel:' }), getCities);

// 获取酒店下房型列表的 public 接口
// 关键：包含具体单词 (/rooms) 的路由，必须放在纯参数 (/:id) 的前面！否则会被吞掉！
router.get('/:id/rooms', getHotelRooms);

// 补上获取详情的 public 接口
router.get('/:id', getDetail);

export default router;
