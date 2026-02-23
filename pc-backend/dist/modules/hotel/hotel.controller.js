"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCities = exports.getHotHotels = exports.listMyHotels = exports.listApprovedHotels = exports.submitHotel = exports.requestDeleteHotel = exports.updateHotel = exports.createHotel = void 0;
const hotel_model_1 = require("./hotel.model");
const room_model_1 = require("../room/room.model");
const merchant_model_1 = require("../merchant/merchant.model");
const audit_model_1 = require("../audit/audit.model");
const notification_service_1 = require("../notification/notification.service");
const hotel_service_1 = require("./hotel.service");
const htmlSanitizer_1 = require("../../utils/htmlSanitizer");
const hotData_service_1 = require("../../services/hotData.service");
// 辅助函数：根据 propertyType 初始化 typeConfig
const initializeTypeConfig = (propertyType = 'hotel', provided) => {
    switch (propertyType) {
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
const propertyTypeToRoomCategory = (propertyType = 'hotel') => {
    const map = {
        'hotel': 'standard',
        'hourlyHotel': 'hourly',
        'homeStay': 'homestay'
    };
    return map[propertyType] || 'standard';
};
const createHotel = async (req, res) => {
    const user = req.user;
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
        // 净化HTML富文本内容，防止XSS攻击
        const sanitizedBase = (0, htmlSanitizer_1.sanitizeObject)(normalizedBase);
        const sanitizedCheckin = (0, htmlSanitizer_1.sanitizeObject)(checkinInfo || {});
        // 查找商户档案，以获取正确的 merchantId
        const merchantProfile = await merchant_model_1.Merchant.findOne({ userId: user.id });
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
        const hotel = await hotel_model_1.Hotel.create({
            merchantId: merchantProfile._id,
            baseInfo: sanitizedBase,
            checkinInfo: sanitizedCheckin,
            typeConfig: initializedTypeConfig,
        });
        // 清除相关缓存
        await hotData_service_1.hotDataService.clearHotelCache();
        res.status(201).json(hotel);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.createHotel = createHotel;
const updateHotel = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const user = req.user;
    try {
        const hotel = await hotel_model_1.Hotel.findById(id);
        console.log('updateHotel called, user:', user.id, 'role:', user.role, 'payload:', JSON.stringify(updates));
        if (!hotel)
            return res.status(404).json({ message: 'Not found' });
        // Check authorization - allow admin or owner merchant
        let merchantProfile = null;
        if (user.role !== 'admin') {
            merchantProfile = await merchant_model_1.Merchant.findOne({ userId: user.id });
            if (!merchantProfile || hotel.merchantId.toString() !== merchantProfile._id.toString()) {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }
        try {
            hotel_service_1.hotelService.checkOptimisticVersion(hotel, updates);
        }
        catch (err) {
            if (err && err.status === 409)
                return res.status(409).json({ message: 'Version conflict' });
            if (err && err.status === 404)
                return res.status(404).json({ message: 'Not found' });
        }
        // 检查是否更改了 propertyType，如果是则需要同步更新房间
        const oldPropertyType = hotel.baseInfo.propertyType || 'hotel';
        const newPropertyType = updates.baseInfo?.propertyType || oldPropertyType;
        // Admins may directly apply changes
        if (user.role === 'admin') {
            if (updates.baseInfo) {
                const sanitizedBase = (0, htmlSanitizer_1.sanitizeObject)(updates.baseInfo);
                hotel.baseInfo = { ...hotel.baseInfo, ...sanitizedBase };
            }
            if (updates.checkinInfo) {
                const sanitizedCheckin = (0, htmlSanitizer_1.sanitizeObject)(updates.checkinInfo);
                hotel.checkinInfo = { ...hotel.checkinInfo, ...sanitizedCheckin };
            }
            if (updates.typeConfig) {
                hotel.typeConfig = initializeTypeConfig(newPropertyType, updates.typeConfig);
            }
            if (updates.auditInfo)
                hotel.auditInfo = { ...hotel.auditInfo, ...updates.auditInfo };
            // If admin applies changes, also clear pendingChanges
            hotel.pendingChanges = null;
            await hotel.save();
            // 如果 propertyType 变更，同时更新所有该酒店的房间
            if (newPropertyType !== oldPropertyType) {
                const newCategory = propertyTypeToRoomCategory(newPropertyType);
                await room_model_1.Room.updateMany({ hotelId: id }, { $set: { 'baseInfo.category': newCategory } });
            }
            // 清除相关缓存
            await hotData_service_1.hotDataService.clearHotelCache();
            return res.json(hotel);
        }
        // Merchant update: delegate to service to save pending changes
        if (user.role !== 'admin') {
            const allowed = {};
            if (updates.baseInfo) {
                const sanitizedBase = (0, htmlSanitizer_1.sanitizeObject)(updates.baseInfo);
                allowed.baseInfo = sanitizedBase;
            }
            if (updates.checkinInfo) {
                const sanitizedCheckin = (0, htmlSanitizer_1.sanitizeObject)(updates.checkinInfo);
                allowed.checkinInfo = sanitizedCheckin;
            }
            if (Object.keys(allowed).length === 0)
                return res.status(400).json({ message: 'No updatable fields provided' });
            try {
                const merchantIdToUse = merchantProfile?._id?.toString() || user.id;
                const updated = await hotel_service_1.hotelService.savePendingChanges(id, merchantIdToUse, allowed);
                // 清除相关缓存
                await hotData_service_1.hotDataService.clearHotelCache();
                return res.json(updated);
            }
            catch (err) {
                if (err && err.status)
                    return res.status(err.status).json({ message: err.message });
                return res.status(400).json({ message: err.message });
            }
        }
    }
    catch (err) {
        console.error('updateHotel catch error:', err);
        res.status(400).json({ message: err.message });
    }
};
exports.updateHotel = updateHotel;
const requestDeleteHotel = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        const hotel = await hotel_model_1.Hotel.findById(id);
        if (!hotel)
            return res.status(404).json({ message: 'Not found' });
        // Check authorization
        if (user.role !== 'admin') {
            const merchantProfile = await merchant_model_1.Merchant.findOne({ userId: user.id });
            if (!merchantProfile || hotel.merchantId.toString() !== merchantProfile._id.toString()) {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }
        // mark deletion request
        hotel.pendingDeletion = true;
        hotel.auditInfo = hotel.auditInfo || {};
        // @ts-ignore
        hotel.auditInfo.status = 'pending';
        hotel.markModified('auditInfo');
        await hotel.save();
        const log = await audit_model_1.AuditLog.create({
            targetType: 'hotel',
            targetId: hotel._id,
            action: 'delete_request',
            operatorId: user.id,
        });
        // notify admins
        await notification_service_1.notificationService.notifyAdmins(`Hotel delete requested: ${hotel._id}`, { auditId: log._id, type: 'delete_request' });
        res.json(hotel);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.requestDeleteHotel = requestDeleteHotel;
const submitHotel = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        const hotel = await hotel_model_1.Hotel.findById(id);
        if (!hotel)
            return res.status(404).json({ message: 'Not found' });
        // Check authorization - only owner merchant can submit
        const merchantProfile = await merchant_model_1.Merchant.findOne({ userId: user.id });
        if (!merchantProfile || hotel.merchantId.toString() !== merchantProfile._id.toString()) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const updated = await hotel_model_1.Hotel.findByIdAndUpdate(id, { $set: { 'auditInfo.status': 'pending' } }, { new: true });
        if (!updated)
            return res.status(404).json({ message: 'Not found' });
        // write audit log
        await audit_model_1.AuditLog.create({
            targetType: 'hotel',
            targetId: updated._id,
            action: 'submit',
            operatorId: user.id,
        });
        // notify admins about pending audit
        const resourceName = updated.baseInfo.nameCn || '酒店';
        await notification_service_1.notificationService.notifyAdminsAuditPending('hotel', updated._id.toString(), resourceName, {
            hotelId: updated._id,
            hotelName: resourceName,
        });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.submitHotel = submitHotel;
const listApprovedHotels = async (req, res) => {
    const { city, star, search, page = 1, limit = 20, propertyType } = req.query;
    const filter = { 'auditInfo.status': 'approved' };
    if (city)
        filter['baseInfo.city'] = city;
    if (star)
        filter['baseInfo.star'] = parseInt(star, 10);
    if (propertyType)
        filter['baseInfo.propertyType'] = propertyType; // 新增
    // 使用MongoDB全文搜索功能
    if (search) {
        filter.$text = { $search: search };
    }
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
    const skip = (pageNum - 1) * limitNum;
    const total = await hotel_model_1.Hotel.countDocuments(filter);
    // 构建查询
    let query = hotel_model_1.Hotel.find(filter);
    // 如果使用了全文搜索，按相关性排序
    if (search) {
        query = query.sort({ score: { $meta: 'textScore' } });
    }
    else {
        // 否则按创建时间排序
        query = query.sort({ createdAt: -1 });
    }
    const hotels = await query
        .skip(skip)
        .limit(limitNum);
    res.json({ data: hotels, meta: { total, page: pageNum, limit: limitNum } });
};
exports.listApprovedHotels = listApprovedHotels;
const listMyHotels = async (req, res) => {
    const user = req.user;
    const { status, search } = req.query;
    const limit = Math.min(parseInt(req.query.limit || '100', 10) || 100, 500);
    const page = Math.max(parseInt(req.query.page || '1', 10) || 1, 1);
    try {
        // Get merchant profile to find correct merchantId
        const merchantProfile = await merchant_model_1.Merchant.findOne({ userId: user.id });
        if (!merchantProfile) {
            return res.status(400).json({ message: '商户档案未找到' });
        }
        const filter = { merchantId: merchantProfile._id };
        if (status)
            filter['auditInfo.status'] = status;
        // 使用MongoDB全文搜索功能
        if (search) {
            filter.$text = { $search: search };
        }
        const total = await hotel_model_1.Hotel.countDocuments(filter);
        const data = await hotel_model_1.Hotel.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.json({ data, meta: { total, page, limit } });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.listMyHotels = listMyHotels;
/**
 * 获取热门酒店
 */
const getHotHotels = async (req, res) => {
    const { limit } = req.query;
    const limitNum = Math.min(parseInt(limit || '10', 10) || 10, 50);
    try {
        const hotels = await hotData_service_1.hotDataService.getHotHotels(limitNum);
        res.json(hotels);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getHotHotels = getHotHotels;
/**
 * 获取城市列表
 */
const getCities = async (req, res) => {
    try {
        const cities = await hotData_service_1.hotDataService.getCities();
        res.json(cities);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCities = getCities;
//# sourceMappingURL=hotel.controller.js.map