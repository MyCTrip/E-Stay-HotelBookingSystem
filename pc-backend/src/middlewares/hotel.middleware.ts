import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { Hotel } from '../modules/hotel/hotel.model';

export const requireHotelApproved = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const hotelId = req.params.hotelId || req.body.hotelId || req.params.id;
  if (!hotelId) return res.status(400).json({ message: 'hotelId is required' });
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    // debug: print auditInfo for investigation
    // eslint-disable-next-line no-console
    console.log('requireHotelApproved check:', hotelId, JSON.stringify(hotel.auditInfo));
    if (hotel.auditInfo?.status !== 'approved')
      return res.status(403).json({ message: 'Hotel not approved' });
    next();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
