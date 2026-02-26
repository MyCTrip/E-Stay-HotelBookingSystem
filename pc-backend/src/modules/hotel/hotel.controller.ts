import { Request, Response } from 'express';
import { Hotel } from './hotel.model';
import { Room } from '../room/room.model';
import { Merchant } from '../merchant/merchant.model';
import { AuditLog } from '../audit/audit.model';
import { notificationService } from '../notification/notification.service';
import { hotelService, ServiceError } from './hotel.service';
import { sanitizeObject } from '../../utils/htmlSanitizer';
import { hotDataService } from '../../services/hotData.service';
import { createHotelSchema } from './hotel.schema';
import { z } from 'zod';

// 辅助函数：根据 propertyType 初始化 typeConfig
const initializeTypeConfig = (propertyType: string = 'hotel', provided?: any) => {
  switch(propertyType) {
    case 'hourlyHotel':
      return {
        hourly: {
          baseConfig: {
            pricePerHour: provided?.hourly?.baseConfig?.pricePerHour,
            minimumHours: provided?.hourly?.baseConfig?.minimumHours || 2,
            timeSlots: provided?.hourly?.baseConfig?.timeSlots || [],
            cleaningTime: provided?.hourly?.baseConfig?.cleaningTime || 45,
            maxBookingsPerDay: provided?.hourly?.baseConfig?.maxBookingsPerDay || 4,
          },
        },
      };
    case 'homeStay':
      return {
        homestay: {
          hostName: provided?.homestay?.hostName,
          hostPhone: provided?.homestay?.hostPhone,
          responseTimeHours: provided?.homestay?.responseTimeHours || 24,
          instantBooking: provided?.homestay?.instantBooking ?? true,
          minStay: provided?.homestay?.minStay || 1,
          maxStay: provided?.homestay?.maxStay,
          cancellationPolicy: provided?.homestay?.cancellationPolicy || 'moderate',
          securityDeposit: provided?.homestay?.securityDeposit,
          amenityTags: provided?.homestay?.amenityTags || [],
        },
      };
    default: // hotel
      return {};
  }
};

// 辅助函数：propertyType 转 roomCategory
const propertyTypeToRoomCategory = (propertyType: string = 'hotel'): string => {
  const map: any = {
    'hotel': 'standard',
    'hourlyHotel': 'hourly',
    'homeStay': 'homestay'
  };
  return map[propertyType] || 'standard';
};

export const createHotel = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { baseInfo, checkinInfo, typeConfig } = req.body;

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
    // 🔍 DEBUG: 打印接收到的数据
    console.log('📥 createHotel received baseInfo:', JSON.stringify(normalizedBase, null, 2));

    // 净化HTML富文本内容，防止XSS攻击
    const sanitizedBase = sanitizeObject(normalizedBase);
    const sanitizedCheckin = sanitizeObject(checkinInfo || {});
    
    // 🔍 DEBUG: 打印 sanitized 后的数据
    console.log('🧹 After sanitization, images:', sanitizedBase.images);

    // 查找商户档案，以获取正确的 merchantId
    const merchantProfile = await Merchant.findOne({ userId: user.id });
    if (!merchantProfile) {
      return res.status(400).json({ message: '商户档案未找到' });
    }
    
    // 提取并验证 propertyType
    const propertyType = sanitizedBase.propertyType || 'hotel';
    
    // 验证钟点房和民宿的必填字段
    if (propertyType === 'hourlyHotel' && !typeConfig?.hourly?.baseConfig?.timeSlots?.length) {
      return res.status(400).json({
        status: 'error',
        message: '钟点房必须提供 typeConfig.hourly.baseConfig.timeSlots 配置'
      });
    }
    
    if (propertyType === 'homeStay' && !typeConfig?.homestay?.hostName) {
      return res.status(400).json({
        status: 'error',
        message: '民宿必须提供房东信息'
      });
    }

    // 初始化 typeConfig
    const initializedTypeConfig = initializeTypeConfig(propertyType, typeConfig);
    
    const hotel = await Hotel.create({
      merchantId: merchantProfile._id,
      baseInfo: sanitizedBase,
      checkinInfo: sanitizedCheckin,
      typeConfig: initializedTypeConfig,
    });

    // 🔍 DEBUG: 打印保存后的数据
    console.log('✅ Hotel created with images:', hotel.baseInfo.images);
    
    // 清除相关缓存
    await hotDataService.clearHotelCache();
    
    res.status(201).json(hotel);
  } catch (err: any) {
    console.error('❌ createHotel error:', err);
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

    // 检查是否更改了 propertyType，如果是则需要同步更新房间
    const oldPropertyType = hotel.baseInfo.propertyType || 'hotel';
    const newPropertyType = updates.baseInfo?.propertyType || oldPropertyType;
    
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
        if (updates.typeConfig) {
          hotel.typeConfig = initializeTypeConfig(newPropertyType, updates.typeConfig);
        }
        if (updates.auditInfo) hotel.auditInfo = { ...hotel.auditInfo, ...updates.auditInfo };
        // If admin applies changes, also clear pendingChanges
        hotel.pendingChanges = null;
        await hotel.save();
        
        // 如果 propertyType 变更，同时更新所有该酒店的房间
        if (newPropertyType !== oldPropertyType) {
          const newCategory = propertyTypeToRoomCategory(newPropertyType);
          await Room.updateMany(
            { hotelId: id },
            { $set: { 'baseInfo.category': newCategory } }
          );
        }
        
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
  const { city, star, search, page = 1, limit = 20, propertyType } = req.query as any;
  const filter: any = { 'auditInfo.status': 'approved' };
  
  if (city) filter['baseInfo.city'] = city;
  if (star) filter['baseInfo.star'] = parseInt(star, 10);
  if (propertyType) filter['baseInfo.propertyType'] = propertyType; // 新增
  
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

    // 🔍 DEBUG: 为每个酒店打印 images 数据
    data.forEach((hotel, idx) => {
      console.log(`[${idx}] Hotel: ${hotel.baseInfo.nameCn}`);
      console.log(`  baseInfo.images:`, hotel.baseInfo.images);
      console.log(`  pendingChanges:`, hotel.pendingChanges);
    });

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
 * 获取酒店详情
 */
export const getDetail = async (req: Request, res: Response) => {
  try {
    // 通过 ID 去数据库查酒店
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: '未找到该酒店' });
    }

    // 按标准格式返回
    res.status(200).json({
      code: 200,
      data: hotel,
      message: 'success'
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

/**
 * 获取酒店的房型列表（兼容 PC 端分页 与 移动端公开访问）
 */
export const getHotelRooms = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, page = 1, limit = 10 } = req.query as any;

    // 1. 构造基础查询
    const filter: any = { hotelId: id };

    // 2. 状态过滤：如果是移动端游客(传了 approved) 或 PC端特定筛选
    if (status) {
      // 假设房间的状态存在 auditInfo.status 里
      filter['auditInfo.status'] = status; 
    }

    // 3. 解析分页参数（核心修复点，专门为 PC 端服务）
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(parseInt(limit, 10) || 10, 100);
    const skip = (pageNum - 1) * limitNum;

    // 4. 去数据库查总数和真实的分页数据
    const total = await Room.countDocuments(filter);
    const rooms = await Room.find(filter)
      .sort({ createdAt: -1 }) // 按创建时间倒序
      .skip(skip)
      .limit(limitNum);

    // 5. 按照 API 文档恢复最标准的数据格式返回
    res.status(200).json({
      code: 200,
      data: rooms, // 核心修复：把数组直接给 data！解救 PC 端的 Table 组件
      meta: {      //  PC 端依赖的真实分页信息
        total,
        page: pageNum,
        limit: limitNum
      },
      message: 'success'
    });
  } catch (error: any) {
    console.error('获取房型失败:', error);
    res.status(500).json({ message: '服务器错误' });
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
