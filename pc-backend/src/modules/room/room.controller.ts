import { Request, Response } from 'express';
import { Room } from './room.model';
import { Hotel } from '../hotel/hotel.model';
import { AuditLog } from '../audit/audit.model';

export const createRoom = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { baseInfo, headInfo, bedInfo, breakfastInfo } = req.body;
  const hotelId = req.params.hotelId || req.body.hotelId;
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    // only owner merchant can create rooms
    if (hotel.merchantId.toString() !== user.id)
      return res.status(403).json({ message: 'Forbidden' });
    const room = await Room.create({
      hotelId,
      baseInfo: baseInfo || {},
      headInfo: headInfo || {},
      bedInfo: bedInfo || [],
      breakfastInfo: breakfastInfo || {},
      auditInfo: { status: 'draft' },
    });
    res.status(201).json(room);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const user = (req as any).user;
  try {
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: 'Not found' });
    const hotel = await Hotel.findById(room.hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    if (hotel.merchantId.toString() !== user.id && user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });

    if (updates.baseInfo) room.baseInfo = { ...room.baseInfo, ...updates.baseInfo };
    if (updates.headInfo) room.headInfo = { ...room.headInfo, ...updates.headInfo };
    if (updates.bedInfo) room.bedInfo = updates.bedInfo;
    if (updates.breakfastInfo)
      room.breakfastInfo = { ...room.breakfastInfo, ...updates.breakfastInfo };
    await room.save();
    res.json(room);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const submitRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  try {
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: 'Not found' });
    const hotel = await Hotel.findById(room.hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    if (hotel.merchantId.toString() !== user.id)
      return res.status(403).json({ message: 'Forbidden' });
    const updated = await Room.findByIdAndUpdate(
      id,
      { $set: { 'auditInfo.status': 'pending' } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    await AuditLog.create({
      targetType: 'room',
      targetId: updated._id,
      action: 'submit',
      operatorId: user.id,
    });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listRoomsForHotel = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const hotelId = req.params.hotelId || req.params.id;
  const { status, search } = req.query as any;
  const limit = Math.min(parseInt((req.query.limit as any) || '100', 10) || 100, 500);
  const page = Math.max(parseInt((req.query.page as any) || '1', 10) || 1, 1);
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    if (hotel.merchantId.toString() !== user.id && user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });
    const filter: any = { hotelId };
    if (status) filter['auditInfo.status'] = status;
    if (search) filter['baseInfo.type'] = new RegExp(search, 'i');
    const total = await Room.countDocuments(filter);
    const data = await Room.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ data, meta: { total, page, limit } });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const adminApproveRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = (req as any).user;
  try {
    const updated = await Room.findByIdAndUpdate(
      id,
      {
        $set: {
          'auditInfo.status': 'approved',
          'auditInfo.auditedBy': user.id,
          'auditInfo.auditedAt': new Date(),
          'auditInfo.rejectReason': undefined,
        },
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    await AuditLog.create({
      targetType: 'room',
      targetId: updated._id,
      action: 'approve',
      operatorId: user.id,
      reason,
    });
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
    const updated = await Room.findByIdAndUpdate(
      id,
      {
        $set: {
          'auditInfo.status': 'rejected',
          'auditInfo.auditedBy': user.id,
          'auditInfo.auditedAt': new Date(),
          'auditInfo.rejectReason': reason,
        },
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    await AuditLog.create({
      targetType: 'room',
      targetId: updated._id,
      action: 'reject',
      operatorId: user.id,
      reason,
    });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
