import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { createHotel, updateHotel, submitHotel, listApprovedHotels } from './hotel.controller';

const router = Router();

router.post('/', authenticate, createHotel);
router.put('/:id', authenticate, updateHotel);
router.post('/:id/submit', authenticate, submitHotel);
router.get('/', listApprovedHotels);

export default router;