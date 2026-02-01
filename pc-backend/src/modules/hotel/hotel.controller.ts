import { Request, Response } from 'express';
import { Hotel } from './hotel.model';
import { AuditLog } from '../audit/audit.model';

export const createHotel = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { baseInfo, checkinInfo } = req.body;

  // allow legacy flat fields for convenience
  const normalizedBase = baseInfo || {
    nameCn: req.body.nameCn,
    nameEn: req.body.nameEn,
    address: req.body.address,
    city: req.body.city,
    star: req.body.star,
    openTime: req.body.openTime,
    roomTotal: req.body.roomTotal || 0,
    phone: req.body.phone || '',
    description: req.body.description || '',
    images: req.body.images || []
  };

  try {
    const hotel = await Hotel.create({
      merchantId: user.id,
      baseInfo: normalizedBase,
      checkinInfo: checkinInfo || {}
    });
    res.status(201).json(hotel);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const user = (req as any).user;
  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ message: 'Not found' });
    if (hotel.merchantId.toString() !== user.id && user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    // allow updating baseInfo/checkinInfo/auditInfo via body
    if (updates.baseInfo) hotel.baseInfo = { ...hotel.baseInfo, ...updates.baseInfo };
    if (updates.checkinInfo) hotel.checkinInfo = { ...hotel.checkinInfo, ...updates.checkinInfo };
    if (updates.auditInfo && user.role === 'admin') hotel.auditInfo = { ...hotel.auditInfo, ...updates.auditInfo };
    await hotel.save();
    res.json(hotel);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const submitHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ message: 'Not found' });
    if (hotel.merchantId.toString() !== user.id) return res.status(403).json({ message: 'Forbidden' });
    const updated = await Hotel.findByIdAndUpdate(id, { $set: { 'auditInfo.status': 'pending' } }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    // write audit log
    await AuditLog.create({ targetType: 'hotel', targetId: updated._id, action: 'submit', operatorId: user.id });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listApprovedHotels = async (req: Request, res: Response) => {
  const hotels = await Hotel.find({ 'auditInfo.status': 'approved' });
  res.json(hotels);
};