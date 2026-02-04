import { Request, Response } from 'express';
import { Hotel } from '../hotel/hotel.model';
import { Merchant } from '../merchant/merchant.model';
import { merchantService } from '../merchant/merchant.service';
import { adminService } from './admin.service';
import { Room } from '../room/room.model';
import { AuditLog } from '../audit/audit.model';

export const approveHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const reason = req.body.reason;
  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ message: 'Not found' });

    // debug: log auditInfo before applying
    // eslint-disable-next-line no-console
    console.log('approveHotel before apply auditInfo:', JSON.stringify(hotel.auditInfo));

    // If there are pendingChanges, apply them
    // eslint-disable-next-line no-console
    console.log('approveHotel, pendingChanges:', JSON.stringify(hotel.pendingChanges));
    if (hotel.pendingChanges) {
      if (hotel.pendingChanges.baseInfo) {
        Object.keys(hotel.pendingChanges.baseInfo).forEach((k) => {
          // @ts-ignore
          hotel.baseInfo[k] = hotel.pendingChanges.baseInfo[k];
        });
      }
      if (hotel.pendingChanges.checkinInfo) {
        Object.keys(hotel.pendingChanges.checkinInfo).forEach((k) => {
          // @ts-ignore
          hotel.checkinInfo[k] = hotel.pendingChanges.checkinInfo[k];
        });
      }
      hotel.pendingChanges = null;
    }

    // set fields explicitly to ensure mongoose tracks changes
    hotel.auditInfo = hotel.auditInfo || ({} as any);
    // @ts-ignore
    hotel.auditInfo.status = 'approved';
    // @ts-ignore
    hotel.auditInfo.auditedBy = user.id;
    // @ts-ignore
    hotel.auditInfo.auditedAt = new Date();
    // @ts-ignore
    hotel.auditInfo.rejectReason = undefined;
    hotel.markModified('auditInfo');

    await hotel.save();
    console.log('hotel after approve baseInfo:', JSON.stringify(hotel.baseInfo));
    // debug: log auditInfo after approving
    // eslint-disable-next-line no-console
    console.log('hotel auditInfo after approve:', JSON.stringify(hotel.auditInfo));

    // re-read from DB and log auditInfo to ensure persisted
    const fresh = await Hotel.findById(id);
    // eslint-disable-next-line no-console
    console.log('hotel auditInfo reloaded:', JSON.stringify(fresh?.auditInfo));

    await AuditLog.create({
      targetType: 'hotel',
      targetId: hotel._id,
      action: 'approve',
      operatorId: user.id,
      reason,
    });
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
    const updated = await Hotel.findByIdAndUpdate(
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
      targetType: 'hotel',
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

export const offlineHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ message: 'Not found' });
    hotel.auditInfo = {
      ...hotel.auditInfo,
      status: 'offline',
      auditedBy: user.id,
      auditedAt: new Date(),
    } as any;
    await hotel.save();

    await AuditLog.create({
      targetType: 'hotel',
      targetId: hotel._id,
      action: 'offline',
      operatorId: user.id,
    });

    res.json(hotel);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const offlineRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const { reason } = req.body;
  try {
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: 'Not found' });
    room.auditInfo = {
      ...room.auditInfo,
      status: 'offline',
      auditedBy: user.id,
      auditedAt: new Date(),
    } as any;
    await room.save();

    await AuditLog.create({
      targetType: 'room',
      targetId: room._id,
      action: 'offline',
      operatorId: user.id,
      reason,
    });

    res.json(room);
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
    await AuditLog.create({
      targetType: 'merchant',
      targetId: profile._id,
      action: 'approve',
      operatorId: user.id,
      reason,
    });
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
    await AuditLog.create({
      targetType: 'merchant',
      targetId: profile._id,
      action: 'reject',
      operatorId: user.id,
      reason,
    });
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
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: 'Not found' });

    // Apply pending changes if any
    if (room.pendingChanges) {
      if (room.pendingChanges.baseInfo) {
        Object.keys(room.pendingChanges.baseInfo).forEach((k) => {
          // @ts-ignore
          room.baseInfo[k] = room.pendingChanges.baseInfo[k];
        });
      }
      if (room.pendingChanges.headInfo) {
        Object.keys(room.pendingChanges.headInfo).forEach((k) => {
          // @ts-ignore
          room.headInfo[k] = room.pendingChanges.headInfo[k];
        });
      }
      if (room.pendingChanges.bedInfo) room.bedInfo = room.pendingChanges.bedInfo;
      if (room.pendingChanges.breakfastInfo) {
        Object.keys(room.pendingChanges.breakfastInfo).forEach((k) => {
          // @ts-ignore
          room.breakfastInfo[k] = room.pendingChanges.breakfastInfo[k];
        });
      }
      room.pendingChanges = null;
    }

    room.auditInfo = {
      ...room.auditInfo,
      status: 'approved',
      auditedBy: user.id,
      auditedAt: new Date(),
      rejectReason: undefined,
    } as any;

    await room.save();

    await AuditLog.create({
      targetType: 'room',
      targetId: room._id,
      action: 'approve',
      operatorId: user.id,
      reason,
    });
    res.json(room);
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

export const getProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const profile = await adminService.findByUserId(user.id);
    if (!profile) return res.status(404).json({ message: 'Not found' });
    res.json(profile);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listMerchants = async (req: Request, res: Response) => {
  const { status, search } = req.query as any;
  const limit = Math.min(parseInt((req.query.limit as any) || '100', 10) || 100, 500);
  const page = Math.max(parseInt((req.query.page as any) || '1', 10) || 1, 1);
  const filter: any = {};
  if (status) filter['auditInfo.verifyStatus'] = status;
  if (search) filter['baseInfo.merchantName'] = new RegExp(search, 'i');
  const total = await Merchant.find(filter).countDocuments();
  const data = await Merchant.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ data, meta: { total, page, limit } });
};

export const listHotels = async (req: Request, res: Response) => {
  const { status, search, merchantId } = req.query as any;
  const limit = Math.min(parseInt((req.query.limit as any) || '100', 10) || 100, 500);
  const page = Math.max(parseInt((req.query.page as any) || '1', 10) || 1, 1);
  const filter: any = {};
  if (status) filter['auditInfo.status'] = status;
  if (merchantId) filter['merchantId'] = merchantId;
  if (search)
    filter.$or = [
      { 'baseInfo.nameCn': new RegExp(search, 'i') },
      { 'baseInfo.nameEn': new RegExp(search, 'i') },
    ];
  const total = await Hotel.find(filter).countDocuments();
  const data = await Hotel.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ data, meta: { total, page, limit } });
};

export const listRooms = async (req: Request, res: Response) => {
  const { status, search, hotelId } = req.query as any;
  const limit = Math.min(parseInt((req.query.limit as any) || '100', 10) || 100, 500);
  const page = Math.max(parseInt((req.query.page as any) || '1', 10) || 1, 1);
  const filter: any = {};
  if (status) filter['auditInfo.status'] = status;
  if (hotelId) filter['hotelId'] = hotelId;
  if (search) filter['baseInfo.type'] = new RegExp(search, 'i');
  const total = await Room.find(filter).countDocuments();
  const data = await Room.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ data, meta: { total, page, limit } });
};
