import { Request, Response } from 'express';
import { merchantService } from './merchant.service';
import { AuditLog } from '../audit/audit.model';
import { notificationService } from '../notification/notification.service';
import { Notification } from '../notification/notification.model';

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
    await AuditLog.create({
      targetType: 'merchant',
      targetId: profile._id,
      action: 'submit',
      operatorId: user.id,
    });
    
    // notify admins about pending audit
    const resourceName = profile.baseInfo.merchantName || '商户资料';
    await notificationService.notifyAdminsAuditPending('merchant', profile._id.toString(), resourceName, {
      merchantId: profile._id,
      merchantName: resourceName,
    });
    
    // return fresh doc
    const fresh = await merchantService.findById(profile._id.toString());
    res.json(fresh);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * 获取商户的通知列表（审核反馈）
 */
export const getMerchantNotifications = async (req: Request, res: Response) => {
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
    const unreadCount = await Notification.countDocuments({ userId: user.id, read: false });
    
    res.json({ data, meta: { total, page: pageNum, limit: limitNum, unreadCount } });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * 标记商户通知为已读
 */
export const markMerchantNotificationAsRead = async (req: Request, res: Response) => {
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

export const adminApproveMerchant = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = (req as any).user; // admin
  try {
    const profile = await merchantService.setVerifyStatus(id, 'verified');
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
  const user = (req as any).user; // admin
  try {
    const profile = await merchantService.setVerifyStatus(id, 'rejected', reason);
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
