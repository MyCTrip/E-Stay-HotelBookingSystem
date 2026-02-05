import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import { requireMerchantVerified } from '../../middlewares/merchant.middleware';
import { requireHotelApproved } from '../../middlewares/hotel.middleware';
import {
  createRoom,
  updateRoom,
  submitRoom,
  adminApproveRoom,
  adminRejectRoom,
  listRoomsForHotel,
  requestDeleteRoom,
} from './room.controller';
import { createRoomSchema, updateRoomSchema } from './room.schema';

const router = Router();

// 商户在酒店已通过审核情况下创建房间
router.post(
  '/hotels/:hotelId/rooms',
  authenticate,
  requireRole('merchant'),
  requireMerchantVerified,
  requireHotelApproved,
  validateBody(createRoomSchema),
  createRoom
);
// 商户获取某个酒店下的房型列表（仅 owner 可访问）
router.get(
  '/hotels/:hotelId/rooms',
  authenticate,
  requireRole('merchant'),
  requireMerchantVerified,
  listRoomsForHotel
);
router.put('/rooms/:id', authenticate, requireRole('merchant'), updateRoom);
router.post('/rooms/:id/submit', authenticate, requireRole('merchant'), submitRoom);
router.post('/rooms/:id/delete-request', authenticate, requireRole('merchant'), requestDeleteRoom);

// 管理员审核 room
router.post('/rooms/:id/approve', authenticate, requireRole('admin'), adminApproveRoom);
router.post('/rooms/:id/reject', authenticate, requireRole('admin'), adminRejectRoom);

export default router;
