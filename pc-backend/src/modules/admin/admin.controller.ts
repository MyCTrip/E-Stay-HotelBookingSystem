import { Request, Response } from 'express';
import { Hotel } from '../hotel/hotel.model';
import { Merchant } from '../merchant/merchant.model';
import { merchantService } from '../merchant/merchant.service';
import { Room } from '../room/room.model';
import { AuditLog } from '../audit/audit.model';

export const approveHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const reason = req.body.reason;
  try {
    const updated = await Hotel.findByIdAndUpdate(id, { $set: { 'auditInfo.status': 'approved', 'auditInfo.auditedBy': user.id, 'auditInfo.auditedAt': new Date(), 'auditInfo.rejectReason': undefined } }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    await AuditLog.create({ targetType: 'hotel', targetId: updated._id, action: 'approve', operatorId: user.id, reason });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const rejectHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const reason = req.body.reason;
  try {
    const updated = await Hotel.findByIdAndUpdate(id, { $set: { 'auditInfo.status': 'rejected', 'auditInfo.auditedBy': user.id, 'auditInfo.auditedAt': new Date(), 'auditInfo.rejectReason': reason } }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    await AuditLog.create({ targetType: 'hotel', targetId: updated._id, action: 'reject', operatorId: user.id, reason });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const offlineHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ message: 'Not found' });
    hotel.auditInfo = { ...hotel.auditInfo, status: 'offline', auditedBy: user.id, auditedAt: new Date() } as any;
    await hotel.save();

    await AuditLog.create({ targetType: 'hotel', targetId: hotel._id, action: 'offline', operatorId: user.id });

    res.json(hotel);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const adminApproveMerchant = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = (req as any).user;
  try {
    const profile = await merchantService.setVerifyStatus(id, 'verified', undefined, user.id);
    await AuditLog.create({ targetType: 'merchant', targetId: profile._id, action: 'approve', operatorId: user.id, reason });
    res.json(profile);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const adminRejectMerchant = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = (req as any).user;
  try {
    const profile = await merchantService.setVerifyStatus(id, 'rejected', reason, user.id);
    await AuditLog.create({ targetType: 'merchant', targetId: profile._id, action: 'reject', operatorId: user.id, reason });
    res.json(profile);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const adminApproveRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = (req as any).user;
  try {
    const updated = await Room.findByIdAndUpdate(id, { $set: { 'auditInfo.status': 'approved', 'auditInfo.auditedBy': user.id, 'auditInfo.auditedAt': new Date(), 'auditInfo.rejectReason': undefined } }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    await AuditLog.create({ targetType: 'room', targetId: updated._id, action: 'approve', operatorId: user.id, reason });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const adminRejectRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = (req as any).user;
  try {
    const updated = await Room.findByIdAndUpdate(id, { $set: { 'auditInfo.status': 'rejected', 'auditInfo.auditedBy': user.id, 'auditInfo.auditedAt': new Date(), 'auditInfo.rejectReason': reason } }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    await AuditLog.create({ targetType: 'room', targetId: updated._id, action: 'reject', operatorId: user.id, reason });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};