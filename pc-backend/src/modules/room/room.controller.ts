import { Request, Response } from 'express';
import { Room } from './room.model';
import { Hotel } from '../hotel/hotel.model';
import { Merchant } from '../merchant/merchant.model';
import { AuditLog } from '../audit/audit.model';
import { notificationService } from '../notification/notification.service';
import { sanitizeObject } from '../../utils/htmlSanitizer';

// 辅助函数：propertyType 转 roomCategory
const propertyTypeToRoomCategory = (propertyType: string = 'hotel'): string => {
  const map: any = {
    'hotel': 'standard',
    'hourlyHotel': 'hourly',
    'homeStay': 'homestay'
  };
  return map[propertyType] || 'standard';
};

// 辅助函数：初始化 room typeConfig
const initializeRoomTypeConfig = (category: string = 'standard', provided?: any) => {
  switch(category) {
    case 'hourly':
      return {
        hourly: {
          pricePerHour: provided?.hourly?.pricePerHour,
          minimumHours: provided?.hourly?.minimumHours || 2,
          availableTimeSlots: provided?.hourly?.availableTimeSlots || [],
          cleaningTime: provided?.hourly?.cleaningTime || 45,
          maxBookingsPerDay: provided?.hourly?.maxBookingsPerDay || 4,
          hourlyTiers: provided?.hourly?.hourlyTiers || [],
          peakHours: provided?.hourly?.peakHours || [],
        },
      };
    case 'homestay':
      return {
        homestay: {
          pricePerNight: provided?.homestay?.pricePerNight,
          weeklyDiscount: provided?.homestay?.weeklyDiscount,
          monthlyDiscount: provided?.homestay?.monthlyDiscount,
          cleaningFee: provided?.homestay?.cleaningFee,
          securityDeposit: provided?.homestay?.securityDeposit,
          minimumStay: provided?.homestay?.minimumStay || 1,
          maxStay: provided?.homestay?.maxStay,
          maxGuests: provided?.homestay?.maxGuests,
          instantBooking: provided?.homestay?.instantBooking ?? true,
          bedrooms: provided?.homestay?.bedrooms,
          bathrooms: provided?.homestay?.bathrooms,
          area: provided?.homestay?.area,
          cancellationPolicy: provided?.homestay?.cancellationPolicy || 'moderate',
        },
      };
    default: // standard
      return {
        standard: {
          cancellationDeadlineHours: provided?.standard?.cancellationDeadlineHours || 24,
          extensionAllowed: provided?.standard?.extensionAllowed ?? true,
        },
      };
  }
};

export const createRoom = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { baseInfo, headInfo, bedInfo, breakfastInfo, typeConfig } = req.body;
  const hotelId = req.params.hotelId || req.body.hotelId;
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    
    // only owner merchant can create rooms - verify by checking merchantId
    const merchantProfile = await Merchant.findOne({ userId: user.id });
    if (!merchantProfile || hotel.merchantId.toString() !== merchantProfile._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    // Verify hotel is approved
    if (hotel.auditInfo.status !== 'approved') {
      return res.status(400).json({
        status: 'error',
        message: '只有通过审核的酒店才能添加房间'
      });
    }
    
    // 净化HTML富文本内容，防止XSS攻击
    const sanitizedBase = sanitizeObject(baseInfo || {
      facilities: (req.body as any).facilities || [],
      policies: (req.body as any).policies || [],
      bedRemark: (req.body as any).bedRemark || [],
    });
    const sanitizedHead = sanitizeObject(headInfo || {});
    const sanitizedBed = sanitizeObject(bedInfo || []);
    const sanitizedBreakfast = sanitizeObject(breakfastInfo || {});
    
    // 根据 hotel.propertyType 自动设置 category
    const propertyType = hotel.baseInfo.propertyType || 'hotel';
    const category = propertyTypeToRoomCategory(propertyType);
    
    // 初始化 typeConfig
    const initializedTypeConfig = initializeRoomTypeConfig(category, typeConfig);
    
    const room = await Room.create({
      hotelId,
      baseInfo: { ...sanitizedBase, category },
      headInfo: sanitizedHead,
      bedInfo: sanitizedBed,
      breakfastInfo: sanitizedBreakfast,
      typeConfig: initializedTypeConfig,
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
    
    // Check authorization - allow admin or owner merchant
    if (user.role !== 'admin') {
      const merchantProfile = await Merchant.findOne({ userId: user.id });
      if (!merchantProfile || hotel.merchantId.toString() !== merchantProfile._id.toString()) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

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

    // ===============================
    // Merchant update logic
    // ===============================

    // 如果是草稿或已驳回，直接覆盖（不走审核）
    if (
      room.auditInfo?.status === 'draft' ||
      room.auditInfo?.status === 'rejected'
    ) {
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

      await room.save();
      return res.json(room);
    }

    // =====================================
    // 已上线 / 审核中 → 走 pendingChanges
    // =====================================

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

    await notificationService.notifyAdmins(
      `Room update requested: ${room._id}`,
      { auditId: log._id, type: 'update_request' }
    );

    return res.json(room);
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
    if (user.role !== 'admin') {
      const merchantProfile = await Merchant.findOne({ userId: user.id });
      if (!merchantProfile || hotel.merchantId.toString() !== merchantProfile._id.toString()) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

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
    
    // Check authorization - only owner merchant can submit
    const merchantProfile = await Merchant.findOne({ userId: user.id });
    if (!merchantProfile || hotel.merchantId.toString() !== merchantProfile._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
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
    
    // notify admins about pending audit
    const resourceName = updated.baseInfo.type || '房间';
    await notificationService.notifyAdminsAuditPending('room', updated._id.toString(), resourceName, {
      roomId: updated._id,
      roomType: resourceName,
      hotelId: room.hotelId,
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
    if (user.role !== 'admin') {
      const merchantProfile = await Merchant.findOne({ userId: user.id });
      if (!merchantProfile || hotel.merchantId.toString() !== merchantProfile._id.toString()) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }
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
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: 'Not found' });

    // 1. 构建 MongoDB 底层的更新指令对象
    const updateData: any = {
      'auditInfo.status': 'approved',
      'auditInfo.auditedBy': user.id,
      'auditInfo.auditedAt': new Date(),
      pendingChanges: null // 清空待修改项
    };

    // 2. 将商户所有的修改项，拆解成精确的点语法 (dot notation)，强行覆盖
    if (room.pendingChanges) {
      if (room.pendingChanges.baseInfo) {
        Object.keys(room.pendingChanges.baseInfo).forEach(k => {
          updateData[`baseInfo.${k}`] = (room.pendingChanges as any).baseInfo[k];
        });
      }
      if (room.pendingChanges.headInfo) {
        Object.keys(room.pendingChanges.headInfo).forEach(k => {
          updateData[`headInfo.${k}`] = (room.pendingChanges as any).headInfo[k];
        });
      }
      if (room.pendingChanges.bedInfo) {
        updateData.bedInfo = room.pendingChanges.bedInfo;
      }
      if (room.pendingChanges.breakfastInfo) {
        Object.keys(room.pendingChanges.breakfastInfo).forEach(k => {
          updateData[`breakfastInfo.${k}`] = (room.pendingChanges as any).breakfastInfo[k];
        });
      }
    }

    // 3. 🚀 杀手锏：绕过 save()，直接使用 findByIdAndUpdate 强制写库
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      {
        $set: updateData,
        $unset: { 'auditInfo.rejectReason': 1 } // 抹除之前的驳回原因
      },
      { new: true } // 返回最新鲜的数据
    );

    if (!updatedRoom) return res.status(404).json({ message: 'Update failed' });

    // 4. 写日志
    await AuditLog.create({
      targetType: 'room',
      targetId: updatedRoom._id,
      action: 'approve',
      operatorId: user.id,
      reason,
    });
    
    // 5. 发送通知
    const hotel = await Hotel.findById(updatedRoom.hotelId);
    if (hotel) {
      const merchant = await Merchant.findById(hotel.merchantId);
      if (merchant && merchant.userId) {
        const resourceName = updatedRoom.baseInfo?.type || '房间';
        await notificationService.notifyMerchantAuditApproved(
          merchant.userId.toString(),
          'room',
          updatedRoom._id.toString(),
          resourceName,
          user.id
        );
      }
    }
    
    res.json(updatedRoom);
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
