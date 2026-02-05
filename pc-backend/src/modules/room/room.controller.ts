import { Request, Response } from 'express';
import { Room } from './room.model';
import { Hotel } from '../hotel/hotel.model';
import { AuditLog } from '../audit/audit.model';
import { notificationService } from '../notification/notification.service';
import { sanitizeObject } from '../../utils/htmlSanitizer';

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
    // 净化HTML富文本内容，防止XSS攻击
    const sanitizedBase = sanitizeObject(baseInfo || {
      facilities: (req.body as any).facilities || [],
      policies: (req.body as any).policies || [],
      bedRemark: (req.body as any).bedRemark || [],
    });
    const sanitizedHead = sanitizeObject(headInfo || {});
    const sanitizedBed = sanitizeObject(bedInfo || []);
    const sanitizedBreakfast = sanitizeObject(breakfastInfo || {});
    
    const room = await Room.create({
      hotelId,
      baseInfo: sanitizedBase,
      headInfo: sanitizedHead,
      bedInfo: sanitizedBed,
      breakfastInfo: sanitizedBreakfast,
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

    // Check optimistic concurrency if client provided __v or updatedAt
    if (updates.__v !== undefined && updates.__v !== room.__v) {
      return res.status(409).json({ message: 'Version conflict' });
    }
    if (updates.updatedAt && new Date(updates.updatedAt).getTime() !== new Date(room.updatedAt).getTime()) {
      return res.status(409).json({ message: 'Version conflict' });
    }

    // Admin may directly apply changes
    if (user.role === 'admin') {
      if (updates.baseInfo) {
        const sanitizedBase = sanitizeObject(updates.baseInfo);
        room.baseInfo = { ...room.baseInfo, ...sanitizedBase };
      }
      if (updates.headInfo) {
        const sanitizedHead = sanitizeObject(updates.headInfo);
        room.headInfo = { ...room.headInfo, ...sanitizedHead };
      }
      if (updates.bedInfo) {
        const sanitizedBed = sanitizeObject(updates.bedInfo);
        room.bedInfo = sanitizedBed;
      }
      if (updates.breakfastInfo) {
        const sanitizedBreakfast = sanitizeObject(updates.breakfastInfo);
        room.breakfastInfo = { ...room.breakfastInfo, ...sanitizedBreakfast };
      }
      room.pendingChanges = null;
      await room.save();
      return res.json(room);
    }

    // Merchant update: save as pendingChanges and set status to pending
    const allowed: any = {};
    if (updates.baseInfo) {
      const sanitizedBase = sanitizeObject(updates.baseInfo);
      allowed.baseInfo = sanitizedBase;
    }
    if (updates.headInfo) {
      const sanitizedHead = sanitizeObject(updates.headInfo);
      allowed.headInfo = sanitizedHead;
    }
    if (updates.bedInfo) {
      const sanitizedBed = sanitizeObject(updates.bedInfo);
      allowed.bedInfo = sanitizedBed;
    }
    if (updates.breakfastInfo) {
      const sanitizedBreakfast = sanitizeObject(updates.breakfastInfo);
      allowed.breakfastInfo = sanitizedBreakfast;
    }
    if (Object.keys(allowed).length === 0)
      return res.status(400).json({ message: 'No updatable fields provided' });

    room.pendingChanges = { ...(room.pendingChanges || {}), ...allowed };
    room.auditInfo = { ...room.auditInfo, status: 'pending' } as any;
    await room.save();

    const log = await AuditLog.create({
      targetType: 'room',
      targetId: room._id,
      action: 'update_request',
      operatorId: user.id,
    });

    await notificationService.notifyAdmins(`Room update requested: ${room._id}`, { auditId: log._id, type: 'update_request' });

    res.json(room);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const requestDeleteRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  try {
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: 'Not found' });
    const hotel = await Hotel.findById(room.hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    if (hotel.merchantId.toString() !== user.id && user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });

    room.pendingDeletion = true;
    room.auditInfo = room.auditInfo || ({} as any);
    // @ts-ignore
    room.auditInfo.status = 'pending';
    room.markModified('auditInfo');
    await room.save();

    const log = await AuditLog.create({
      targetType: 'room',
      targetId: room._id,
      action: 'delete_request',
      operatorId: user.id,
    });

    await notificationService.notifyAdmins(`Room delete requested: ${room._id}`, { auditId: log._id, type: 'delete_request' });

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
