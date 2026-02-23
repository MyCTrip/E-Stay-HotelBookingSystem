import { Request, Response } from 'express';
import { Hotel } from '../hotel/hotel.model';
import { Merchant } from '../merchant/merchant.model';
import { merchantService } from '../merchant/merchant.service';
import { adminService } from './admin.service';
import { Room } from '../room/room.model';
import { AuditLog } from '../audit/audit.model';
import { Notification } from '../notification/notification.model';
import { hotelService } from '../hotel/hotel.service';
import { notificationService } from '../notification/notification.service';

export const approveHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const reason = req.body.reason;
  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ message: 'Not found' });

    try {
      const applied = await hotelService.applyPendingChanges(id, user.id, reason);
      
      // notify merchant about approval
      const merchant = await Merchant.findById(hotel.merchantId);
      if (merchant && merchant.userId) {
        const resourceName = applied.baseInfo.nameCn || '酒店';
        await notificationService.notifyMerchantAuditApproved(
          merchant.userId.toString(),
          'hotel',
          applied._id.toString(),
          resourceName,
          user.id
        );
      }
      
      res.json(applied);
    } catch (err: any) {
      if (err && err.status) return res.status(err.status).json({ message: err.message });
      return res.status(400).json({ message: err.message });
    }
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

    // clear pendingDeletion if present when rejecting
    if (hotel.pendingDeletion) {
      hotel.pendingDeletion = false;
      hotel.auditInfo = { ...hotel.auditInfo, status: 'rejected', auditedBy: user.id, auditedAt: new Date(), rejectReason: reason } as any;
      await hotel.save();
      await AuditLog.create({
        targetType: 'hotel',
        targetId: hotel._id,
        action: 'reject',
        operatorId: user.id,
        reason,
      });
      
      // notify merchant about rejection
      const merchant = await Merchant.findById(hotel.merchantId);
      if (merchant && merchant.userId) {
        const resourceName = hotel.baseInfo.nameCn || '酒店';
        await notificationService.notifyMerchantAuditRejected(
          merchant.userId.toString(),
          'hotel',
          hotel._id.toString(),
          resourceName,
          reason || '酒店信息审核未通过',
          user.id
        );
      }
      
      return res.json(hotel);
    }

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
    
    // notify merchant about rejection
    const merchant = await Merchant.findById(hotel.merchantId);
    if (merchant && merchant.userId) {
      const resourceName = updated.baseInfo.nameCn || '酒店';
      await notificationService.notifyMerchantAuditRejected(
        merchant.userId.toString(),
        'hotel',
        updated._id.toString(),
        resourceName,
        reason || '酒店信息审核未通过',
        user.id
      );
    }
    
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const adminApproveDeleteHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = (req as any).user;
  try {
    try {
      const applied = await hotelService.approveDelete(id, user.id, reason);
      return res.json(applied);
    } catch (err: any) {
      if (err && err.status) return res.status(err.status).json({ message: err.message });
      return res.status(400).json({ message: err.message });
    }
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const offlineHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const { reason } = req.body;
  
  try {
    // 直接使用 findByIdAndUpdate 强制写库，绕过脏值检测
    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      {
        $set: {
          'auditInfo.status': 'offline',
          'auditInfo.auditedBy': user.id,
          'auditInfo.auditedAt': new Date(),
          'auditInfo.offlineReason': reason,
        }
      },
      { new: true } // 返回最新鲜的数据
    );

    if (!updatedHotel) return res.status(404).json({ message: 'Not found' });

    // 记录审核日志
    await AuditLog.create({
      targetType: 'hotel',
      targetId: updatedHotel._id,
      action: 'offline',
      operatorId: user.id,
      reason,
    });

    res.json(updatedHotel);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const offlineRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const { reason } = req.body; // 注意前端如果有下线原因可以传过来
  
  try {
    // 使用 findByIdAndUpdate 强制直接写库，绕过脏值检测
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      {
        $set: {
          'auditInfo.status': 'offline',
          'auditInfo.auditedBy': user.id,
          'auditInfo.auditedAt': new Date(),
          'auditInfo.offlineReason': reason,
        }
      },
      { new: true }
    );

    if (!updatedRoom) return res.status(404).json({ message: 'Not found' });

    // 记录日志
    await AuditLog.create({
      targetType: 'room',
      targetId: updatedRoom._id,
      action: 'offline',
      operatorId: user.id,
      reason,
    });

    res.json(updatedRoom);
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
    
    // notify merchant about approval
    const resourceName = profile.baseInfo.merchantName || '商户资料';
    await notificationService.notifyMerchantAuditApproved(
      profile.userId.toString(),
      'merchant',
      profile._id.toString(),
      resourceName,
      user.id
    );
    
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
    
    // notify merchant about rejection
    const resourceName = profile.baseInfo.merchantName || '商户资料';
    await notificationService.notifyMerchantAuditRejected(
      profile.userId.toString(),
      'merchant',
      profile._id.toString(),
      resourceName,
      reason || '商户资料审核未通过',
      user.id
    );
    
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
    const room = await Room.findByIdAndUpdate(
      id,
      {
        $set: {
          'auditInfo.status': 'approved',
          'auditInfo.auditedBy': user.id,
          'auditInfo.auditedAt': new Date(),
          'auditInfo.rejectReason': undefined,
          pendingChanges: null,
        },
      },
      { new: true }
    );
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

    // 3. 杀手锏：绕过 save()，直接使用 findByIdAndUpdate 强制写库
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

export const adminApproveDeleteRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = (req as any).user;
  try {
    const room = await Room.findByIdAndUpdate(
      id,
      {
        $set: {
          pendingDeletion: false,
          deletedAt: new Date(),
          'auditInfo.status': 'offline',
          'auditInfo.auditedBy': user.id,
          'auditInfo.auditedAt': new Date(),
        },
      },
      { new: true }
    );
    if (!room) return res.status(404).json({ message: 'Not found' });
    if (!room.pendingDeletion) return res.status(400).json({ message: 'No pending delete request' });

    await AuditLog.create({
      targetType: 'room',
      targetId: room._id,
      action: 'delete',
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
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: 'Not found' });
    
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
    
    // notify merchant about room rejection
    const hotel = await Hotel.findById(room.hotelId);
    if (hotel) {
      const merchant = await Merchant.findById(hotel.merchantId);
      if (merchant && merchant.userId) {
        const resourceName = room.baseInfo.type || '房间';
        await notificationService.notifyMerchantAuditRejected(
          merchant.userId.toString(),
          'room',
          room._id.toString(),
          resourceName,
          reason || '房间信息审核未通过',
          user.id
        );
      }
    }
    
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

export const listNotifications = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { read, type, limit = 20, page = 1 } = req.query as any;
  try {
    const filter: any = { userId: user.id };
    
    // 筛选已读状态
    if (read !== undefined) {
      filter.read = read === 'true' || read === '1';
    }
    
    // 筛选通知类型
    if (type) {
      filter.type = type;
    }
    
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
    const skip = (pageNum - 1) * limitNum;
    
    const total = await Notification.countDocuments(filter);
    const data = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    // 获取未读通知数
    const unreadCount = await notificationService.getUnreadCount(user.id);
    
    res.json({ data, meta: { total, page: pageNum, limit: limitNum, unreadCount } });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * 标记单个通知为已读
 */
export const markNotificationAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  try {
    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ message: 'Not found' });
    if (notification.userId.toString() !== user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updated = await notificationService.markAsRead(id);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * 标记所有通知为已读
 */
export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    await Notification.updateMany({ userId: user.id, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
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
    .select('userId baseInfo qualificationInfo auditInfo createdAt updatedAt')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ data, meta: { total, page, limit } });
};

export const listHotels = async (req: Request, res: Response) => {
  const { status, search, merchantId, propertyType } = req.query as any;
  const limit = Math.min(parseInt((req.query.limit as any) || '100', 10) || 100, 500);
  const page = Math.max(parseInt((req.query.page as any) || '1', 10) || 1, 1);
  const filter: any = {};
  if (status) filter['auditInfo.status'] = status;
  if (merchantId) filter['merchantId'] = merchantId;
  if (propertyType) filter['baseInfo.propertyType'] = propertyType; // 新增
  if (search)
    filter.$or = [
      { 'baseInfo.nameCn': new RegExp(search, 'i') },
      { 'baseInfo.nameEn': new RegExp(search, 'i') },
    ];
  const total = await Hotel.find(filter).countDocuments();
  const data = await Hotel.find(filter)
    .populate({
      path: 'merchantId',
      select: 'baseInfo.merchantName',
    })
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
    .populate({
      path: 'hotelId',
      populate: {
        path: 'merchantId', 
        select: 'baseInfo.merchantName' 
      }
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ data, meta: { total, page, limit } });
};
