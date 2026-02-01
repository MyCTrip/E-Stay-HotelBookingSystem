import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { approveHotel, rejectHotel, offlineHotel } from './admin.controller';

const router = Router();

router.post('/hotels/:id/approve', authenticate, requireRole('admin'), approveHotel);
router.post('/hotels/:id/reject', authenticate, requireRole('admin'), rejectHotel);
router.post('/hotels/:id/offline', authenticate, requireRole('admin'), offlineHotel);

export default router;