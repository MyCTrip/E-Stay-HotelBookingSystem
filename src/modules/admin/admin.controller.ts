import { Request, Response } from 'express';
import { Hotel } from '../hotel/hotel.model';
import { AuditLog } from '../audit/audit.model';

export const approveHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const reason = req.body.reason;
  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ message: 'Not found' });
    hotel.auditInfo = { ...hotel.auditInfo, status: 'approved', auditedBy: user.id, auditedAt: new Date(), rejectReason: undefined };
    await hotel.save();

    await AuditLog.create({ targetType: 'hotel', targetId: hotel._id, action: 'approve', operatorId: user.id, reason });

    res.json(hotel);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const rejectHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const reason = req.body.reason;
  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ message: 'Not found' });
    hotel.auditInfo = { ...hotel.auditInfo, status: 'rejected', auditedBy: user.id, auditedAt: new Date(), rejectReason: reason };
    await hotel.save();

    await AuditLog.create({ targetType: 'hotel', targetId: hotel._id, action: 'reject', operatorId: user.id, reason });

    res.json(hotel);
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
    hotel.auditInfo = { ...hotel.auditInfo, status: 'offline', auditedBy: user.id, auditedAt: new Date() };
    await hotel.save();

    await AuditLog.create({ targetType: 'hotel', targetId: hotel._id, action: 'offline', operatorId: user.id });

    res.json(hotel);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};