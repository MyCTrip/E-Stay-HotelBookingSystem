import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { Merchant } from '../modules/merchant/merchant.model';

export const requireMerchantVerified = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const profile = await Merchant.findOne({ userId: req.user.id });
    if (!profile) return res.status(403).json({ message: 'Merchant profile missing' });
    if (profile.auditInfo?.verifyStatus !== 'verified') return res.status(403).json({ message: 'Merchant not verified' });
    next();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};