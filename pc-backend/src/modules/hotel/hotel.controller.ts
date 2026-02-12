import { Request, Response } from 'express';
import { Hotel } from './hotel.model';
import { Merchant } from '../merchant/merchant.model';
import { AuditLog } from '../audit/audit.model';
import { notificationService } from '../notification/notification.service';
import { hotelService, ServiceError } from './hotel.service';
import { sanitizeObject } from '../../utils/htmlSanitizer';
import { hotDataService } from '../../services/hotData.service';


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
    // 净化HTML富文本内容，防止XSS攻击
    const sanitizedBase = sanitizeObject(normalizedBase);
    const sanitizedCheckin = sanitizeObject(checkinInfo || {});
    
    // 查找商户档案，以获取正确的 merchantId
    const merchantProfile = await Merchant.findOne({ userId: user.id });
    if (!merchantProfile) {
      return res.status(400).json({ message: '商户档案未找到' });
    }
    
    const hotel = await Hotel.create({
      merchantId: merchantProfile._id,
      baseInfo: sanitizedBase,
      checkinInfo: sanitizedCheckin,
    });
    
    // 清除相关缓存
    await hotDataService.clearHotelCache();
    
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
    
    // Check authorization - allow admin or owner merchant
    let merchantProfile: any = null;
    if (user.role !== 'admin') {
      merchantProfile = await Merchant.findOne({ userId: user.id });
      if (!merchantProfile || hotel.merchantId.toString() !== merchantProfile._id.toString()) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    try {
      hotelService.checkOptimisticVersion(hotel, updates);
    } catch (err: any) {
      if (err && err.status === 409) return res.status(409).json({ message: 'Version conflict' });
      if (err && err.status === 404) return res.status(404).json({ message: 'Not found' });
    }

    // Admins may directly apply changes
    if (user.role === 'admin') {
        if (updates.baseInfo) {
          const sanitizedBase = sanitizeObject(updates.baseInfo);
          hotel.baseInfo = { ...hotel.baseInfo, ...sanitizedBase };
        }
        if (updates.checkinInfo) {
          const sanitizedCheckin = sanitizeObject(updates.checkinInfo);
          hotel.checkinInfo = { ...hotel.checkinInfo, ...sanitizedCheckin };
        }
        if (updates.auditInfo) hotel.auditInfo = { ...hotel.auditInfo, ...updates.auditInfo };
        // If admin applies changes, also clear pendingChanges
        hotel.pendingChanges = null;
        await hotel.save();
        
        // 清除相关缓存
        await hotDataService.clearHotelCache();
        
        return res.json(hotel);
      }

    // Merchant update: delegate to service to save pending changes
    if (user.role !== 'admin') {
      const allowed: any = {};
      if (updates.baseInfo) {
        const sanitizedBase = sanitizeObject(updates.baseInfo);
        allowed.baseInfo = sanitizedBase;
      }
      if (updates.checkinInfo) {
        const sanitizedCheckin = sanitizeObject(updates.checkinInfo);
        allowed.checkinInfo = sanitizedCheckin;
      }
      if (Object.keys(allowed).length === 0) return res.status(400).json({ message: 'No updatable fields provided' });
      try {
        const merchantIdToUse = merchantProfile?._id?.toString() || user.id;
        const updated = await hotelService.savePendingChanges(id, merchantIdToUse, allowed);
        
        // 清除相关缓存
        await hotDataService.clearHotelCache();
        
        return res.json(updated);
      } catch (err: any) {
        if (err && err.status) return res.status(err.status).json({ message: err.message });
        return res.status(400).json({ message: err.message });
      }
    }
  } catch (err: any) {
    console.error('updateHotel catch error:', err);
    res.status(400).json({ message: err.message });
  }
};

export const requestDeleteHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ message: 'Not found' });
    
    // Check authorization
    if (user.role !== 'admin') {
      const merchantProfile = await Merchant.findOne({ userId: user.id });
      if (!merchantProfile || hotel.merchantId.toString() !== merchantProfile._id.toString()) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    // mark deletion request
    hotel.pendingDeletion = true;
    hotel.auditInfo = hotel.auditInfo || ({} as any);
    // @ts-ignore
    hotel.auditInfo.status = 'pending';
    hotel.markModified('auditInfo');
    await hotel.save();

    const log = await AuditLog.create({
      targetType: 'hotel',
      targetId: hotel._id,
      action: 'delete_request',
      operatorId: user.id,
    });

    // notify admins
    await notificationService.notifyAdmins(`Hotel delete requested: ${hotel._id}`, { auditId: log._id, type: 'delete_request' });

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
    
    // Check authorization - only owner merchant can submit
    const merchantProfile = await Merchant.findOne({ userId: user.id });
    if (!merchantProfile || hotel.merchantId.toString() !== merchantProfile._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
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
    
    // notify admins about pending audit
    const resourceName = updated.baseInfo.nameCn || '酒店';
    await notificationService.notifyAdminsAuditPending('hotel', updated._id.toString(), resourceName, {
      hotelId: updated._id,
      hotelName: resourceName,
    });
    
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listApprovedHotels = async (req: Request, res: Response) => {
  const { city, star, search, page = 1, limit = 20 } = req.query as any;
  const filter: any = { 'auditInfo.status': 'approved' };
  
  if (city) filter['baseInfo.city'] = city;
  if (star) filter['baseInfo.star'] = parseInt(star, 10);
  
  // 使用MongoDB全文搜索功能
  if (search) {
    filter.$text = { $search: search };
  }
  
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
  const skip = (pageNum - 1) * limitNum;
  
  const total = await Hotel.countDocuments(filter);
  
  // 构建查询
  let query = Hotel.find(filter);
  
  // 如果使用了全文搜索，按相关性排序
  if (search) {
    query = query.sort({ score: { $meta: 'textScore' } });
  } else {
    // 否则按创建时间排序
    query = query.sort({ createdAt: -1 });
  }
  
  const hotels = await query
    .skip(skip)
    .limit(limitNum);
  
  res.json({ data: hotels, meta: { total, page: pageNum, limit: limitNum } });
};

export const listMyHotels = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { status, search } = req.query as any;
  const limit = Math.min(parseInt((req.query.limit as any) || '100', 10) || 100, 500);
  const page = Math.max(parseInt((req.query.page as any) || '1', 10) || 1, 1);
  
  try {
    // Get merchant profile to find correct merchantId
    const merchantProfile = await Merchant.findOne({ userId: user.id });
    if (!merchantProfile) {
      return res.status(400).json({ message: '商户档案未找到' });
    }
    
    const filter: any = { merchantId: merchantProfile._id };
    
    if (status) filter['auditInfo.status'] = status;
    
    // 使用MongoDB全文搜索功能
    if (search) {
      filter.$text = { $search: search };
    }

    const total = await Hotel.countDocuments(filter);
    const data = await Hotel.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
    res.json({ data, meta: { total, page, limit } });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * 获取热门酒店
 */
export const getHotHotels = async (req: Request, res: Response) => {
  const { limit } = req.query as any;
  const limitNum = Math.min(parseInt(limit || '10', 10) || 10, 50);
  
  try {
    const hotels = await hotDataService.getHotHotels(limitNum);
    res.json(hotels);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 获取城市列表
 */
export const getCities = async (req: Request, res: Response) => {
  try {
    const cities = await hotDataService.getCities();
    res.json(cities);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
