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
    images: req.body.images || [],
  };

  try {
    const hotel = await Hotel.create({
      merchantId: user.id,
      baseInfo: normalizedBase,
      checkinInfo: checkinInfo || {},
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
    console.log('updateHotel called, user:', user.id, 'role:', user.role, 'payload:', JSON.stringify(updates));
    if (!hotel) return res.status(404).json({ message: 'Not found' });
    if (hotel.merchantId.toString() !== user.id && user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });

    // Admins may directly apply changes
    if (user.role === 'admin') {
      if (updates.baseInfo) hotel.baseInfo = { ...hotel.baseInfo, ...updates.baseInfo };
      if (updates.checkinInfo) hotel.checkinInfo = { ...hotel.checkinInfo, ...updates.checkinInfo };
      if (updates.auditInfo) hotel.auditInfo = { ...hotel.auditInfo, ...updates.auditInfo };
      // If admin applies changes, also clear pendingChanges
      hotel.pendingChanges = null;
      await hotel.save();
      return res.json(hotel);
    }

    // Merchant update: save as pendingChanges and set status to pending
    const allowed: any = {};
    if (updates.baseInfo) allowed.baseInfo = updates.baseInfo;
    if (updates.checkinInfo) allowed.checkinInfo = updates.checkinInfo;
    if (Object.keys(allowed).length === 0)
      return res.status(400).json({ message: 'No updatable fields provided' });

    hotel.pendingChanges = { ...(hotel.pendingChanges || {}), ...allowed };
    hotel.auditInfo = hotel.auditInfo || ({} as any);
    // explicitly set fields so mongoose tracks changes
    // @ts-ignore
    hotel.auditInfo.status = 'pending';
    // clear previous audit info
    // @ts-ignore
    hotel.auditInfo.auditedBy = null;
    // @ts-ignore
    hotel.auditInfo.auditedAt = null;
    hotel.markModified('auditInfo');

    console.log('Saving hotel with pendingChanges:', JSON.stringify(hotel.pendingChanges));
    try {
      await hotel.save();
    } catch (err: any) {
      console.error('hotel.save error:', err);
      return res.status(400).json({ message: err.message });
    }

    // debug: log auditInfo after merchant update
    // eslint-disable-next-line no-console
    console.log('hotel auditInfo after update_request:', JSON.stringify(hotel.auditInfo));

    console.log('Creating AuditLog for update_request');
    await AuditLog.create({
      targetType: 'hotel',
      targetId: hotel._id,
      action: 'update_request',
      operatorId: user.id,
    });
    console.log('Responding with hotel after update_request');
    res.json(hotel);
  } catch (err: any) {
    console.error('updateHotel catch error:', err);
    res.status(400).json({ message: err.message });
  }
};

export const submitHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ message: 'Not found' });
    if (hotel.merchantId.toString() !== user.id)
      return res.status(403).json({ message: 'Forbidden' });
    const updated = await Hotel.findByIdAndUpdate(
      id,
      { $set: { 'auditInfo.status': 'pending' } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    // write audit log
    await AuditLog.create({
      targetType: 'hotel',
      targetId: updated._id,
      action: 'submit',
      operatorId: user.id,
    });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listApprovedHotels = async (req: Request, res: Response) => {
  const hotels = await Hotel.find({ 'auditInfo.status': 'approved' });
  res.json(hotels);
};

export const listMyHotels = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { status, search } = req.query as any;
  const limit = Math.min(parseInt((req.query.limit as any) || '100', 10) || 100, 500);
  const page = Math.max(parseInt((req.query.page as any) || '1', 10) || 1, 1);
  const filter: any = { merchantId: user.id };
  if (status) filter['auditInfo.status'] = status;
  if (search)
    filter.$or = [
      { 'baseInfo.nameCn': new RegExp(search, 'i') },
      { 'baseInfo.nameEn': new RegExp(search, 'i') },
    ];

  const total = await Hotel.countDocuments(filter);
  const data = await Hotel.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ data, meta: { total, page, limit } });
};
