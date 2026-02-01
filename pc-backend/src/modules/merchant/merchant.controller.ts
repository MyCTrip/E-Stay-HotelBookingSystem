import { Request, Response } from 'express';
import { merchantService } from './merchant.service';
import { AuditLog } from '../audit/audit.model';

export const getProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const profile = await merchantService.findByUserId(user.id);
  if (!profile) return res.status(404).json({ message: 'Not found' });
  res.json(profile);
};

export const upsertProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const profile = await merchantService.upsertByUserId(user.id, req.body);
    res.json(profile);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const submitProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const profile = await merchantService.submitByUserId(user.id);
    // write audit log (operatorId == user submitting)
    await AuditLog.create({ targetType: 'merchant', targetId: profile._id, action: 'submit', operatorId: user.id });
    // return fresh doc
    const fresh = await merchantService.findById(profile._id.toString());
    res.json(fresh);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const adminApproveMerchant = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = (req as any).user; // admin
  try {
    const profile = await merchantService.setVerifyStatus(id, 'verified');
    await AuditLog.create({ targetType: 'merchant', targetId: profile._id, action: 'approve', operatorId: user.id, reason });
    res.json(profile);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const adminRejectMerchant = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = (req as any).user; // admin
  try {
    const profile = await merchantService.setVerifyStatus(id, 'rejected', reason);
    await AuditLog.create({ targetType: 'merchant', targetId: profile._id, action: 'reject', operatorId: user.id, reason });
    res.json(profile);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};