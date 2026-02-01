import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import { requireMerchantVerified } from '../../middlewares/merchant.middleware';
import { requireHotelApproved } from '../../middlewares/hotel.middleware';
import { createRoom, updateRoom, submitRoom, adminApproveRoom, adminRejectRoom } from './room.controller';
import { createRoomSchema, updateRoomSchema } from './room.schema';

const router = Router();

// 商户在酒店已通过审核情况下创建房间
router.post('/hotels/:hotelId/rooms', authenticate, requireRole('merchant'), requireMerchantVerified, requireHotelApproved, validateBody(createRoomSchema), createRoom);
router.put('/rooms/:id', authenticate, requireRole('merchant'), updateRoom);
router.post('/rooms/:id/submit', authenticate, requireRole('merchant'), submitRoom);

// 管理员审核 room
router.post('/rooms/:id/approve', authenticate, requireRole('admin'), adminApproveRoom);
router.post('/rooms/:id/reject', authenticate, requireRole('admin'), adminRejectRoom);

export default router;