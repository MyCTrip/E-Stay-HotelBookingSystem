"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRejectRoom = exports.adminApproveRoom = exports.listRoomsForHotel = exports.submitRoom = exports.requestDeleteRoom = exports.updateRoom = exports.createRoom = void 0;
const room_model_1 = require("./room.model");
const hotel_model_1 = require("../hotel/hotel.model");
const merchant_model_1 = require("../merchant/merchant.model");
const audit_model_1 = require("../audit/audit.model");
const notification_service_1 = require("../notification/notification.service");
const htmlSanitizer_1 = require("../../utils/htmlSanitizer");
// 辅助函数：propertyType 转 roomCategory
const propertyTypeToRoomCategory = (propertyType = 'hotel') => {
    const map = {
        'hotel': 'standard',
        'hourlyHotel': 'hourly',
        'homeStay': 'homestay'
    };
    return map[propertyType] || 'standard';
};
// 辅助函数：初始化 room typeConfig
const initializeRoomTypeConfig = (category = 'standard', provided) => {
    switch (category) {
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
const createRoom = async (req, res) => {
    const user = req.user;
    const { baseInfo, headInfo, bedInfo, breakfastInfo, typeConfig } = req.body;
    const hotelId = req.params.hotelId || req.body.hotelId;
    try {
        const hotel = await hotel_model_1.Hotel.findById(hotelId);
        if (!hotel)
            return res.status(404).json({ message: 'Hotel not found' });
        // only owner merchant can create rooms - verify by checking merchantId
        const merchantProfile = await merchant_model_1.Merchant.findOne({ userId: user.id });
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
        const sanitizedBase = (0, htmlSanitizer_1.sanitizeObject)(baseInfo || {
            facilities: req.body.facilities || [],
            policies: req.body.policies || [],
            bedRemark: req.body.bedRemark || [],
        });
        const sanitizedHead = (0, htmlSanitizer_1.sanitizeObject)(headInfo || {});
        const sanitizedBed = (0, htmlSanitizer_1.sanitizeObject)(bedInfo || []);
        const sanitizedBreakfast = (0, htmlSanitizer_1.sanitizeObject)(breakfastInfo || {});
        // 根据 hotel.propertyType 自动设置 category
        const propertyType = hotel.baseInfo.propertyType || 'hotel';
        const category = propertyTypeToRoomCategory(propertyType);
        // 初始化 typeConfig
        const initializedTypeConfig = initializeRoomTypeConfig(category, typeConfig);
        const room = await room_model_1.Room.create({
            hotelId,
            baseInfo: { ...sanitizedBase, category },
            headInfo: sanitizedHead,
            bedInfo: sanitizedBed,
            breakfastInfo: sanitizedBreakfast,
            typeConfig: initializedTypeConfig,
            auditInfo: { status: 'draft' },
        });
        res.status(201).json(room);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.createRoom = createRoom;
const updateRoom = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const user = req.user;
    try {
        const room = await room_model_1.Room.findById(id);
        if (!room)
            return res.status(404).json({ message: 'Not found' });
        const hotel = await hotel_model_1.Hotel.findById(room.hotelId);
        if (!hotel)
            return res.status(404).json({ message: 'Hotel not found' });
        // Check authorization - allow admin or owner merchant
        if (user.role !== 'admin') {
            const merchantProfile = await merchant_model_1.Merchant.findOne({ userId: user.id });
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
                const sanitizedBase = (0, htmlSanitizer_1.sanitizeObject)(updates.baseInfo);
                room.baseInfo = { ...room.baseInfo, ...sanitizedBase };
            }
            if (updates.headInfo) {
                const sanitizedHead = (0, htmlSanitizer_1.sanitizeObject)(updates.headInfo);
                room.headInfo = { ...room.headInfo, ...sanitizedHead };
            }
            if (updates.bedInfo) {
                const sanitizedBed = (0, htmlSanitizer_1.sanitizeObject)(updates.bedInfo);
                room.bedInfo = sanitizedBed;
            }
            if (updates.breakfastInfo) {
                const sanitizedBreakfast = (0, htmlSanitizer_1.sanitizeObject)(updates.breakfastInfo);
                room.breakfastInfo = { ...room.breakfastInfo, ...sanitizedBreakfast };
            }
            room.pendingChanges = null;
            await room.save();
            return res.json(room);
        }
        // Merchant update: save as pendingChanges and set status to pending
        const allowed = {};
        if (updates.baseInfo) {
            const sanitizedBase = (0, htmlSanitizer_1.sanitizeObject)(updates.baseInfo);
            allowed.baseInfo = sanitizedBase;
        }
        if (updates.headInfo) {
            const sanitizedHead = (0, htmlSanitizer_1.sanitizeObject)(updates.headInfo);
            allowed.headInfo = sanitizedHead;
        }
        if (updates.bedInfo) {
            const sanitizedBed = (0, htmlSanitizer_1.sanitizeObject)(updates.bedInfo);
            allowed.bedInfo = sanitizedBed;
        }
        if (updates.breakfastInfo) {
            const sanitizedBreakfast = (0, htmlSanitizer_1.sanitizeObject)(updates.breakfastInfo);
            allowed.breakfastInfo = sanitizedBreakfast;
        }
        if (Object.keys(allowed).length === 0)
            return res.status(400).json({ message: 'No updatable fields provided' });
        room.pendingChanges = { ...(room.pendingChanges || {}), ...allowed };
        room.auditInfo = { ...room.auditInfo, status: 'pending' };
        await room.save();
        const log = await audit_model_1.AuditLog.create({
            targetType: 'room',
            targetId: room._id,
            action: 'update_request',
            operatorId: user.id,
        });
        await notification_service_1.notificationService.notifyAdmins(`Room update requested: ${room._id}`, { auditId: log._id, type: 'update_request' });
        res.json(room);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.updateRoom = updateRoom;
const requestDeleteRoom = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        const room = await room_model_1.Room.findById(id);
        if (!room)
            return res.status(404).json({ message: 'Not found' });
        const hotel = await hotel_model_1.Hotel.findById(room.hotelId);
        if (!hotel)
            return res.status(404).json({ message: 'Hotel not found' });
        if (user.role !== 'admin') {
            const merchantProfile = await merchant_model_1.Merchant.findOne({ userId: user.id });
            if (!merchantProfile || hotel.merchantId.toString() !== merchantProfile._id.toString()) {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }
        room.pendingDeletion = true;
        room.auditInfo = room.auditInfo || {};
        // @ts-ignore
        room.auditInfo.status = 'pending';
        room.markModified('auditInfo');
        await room.save();
        const log = await audit_model_1.AuditLog.create({
            targetType: 'room',
            targetId: room._id,
            action: 'delete_request',
            operatorId: user.id,
        });
        await notification_service_1.notificationService.notifyAdmins(`Room delete requested: ${room._id}`, { auditId: log._id, type: 'delete_request' });
        res.json(room);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.requestDeleteRoom = requestDeleteRoom;
const submitRoom = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        const room = await room_model_1.Room.findById(id);
        if (!room)
            return res.status(404).json({ message: 'Not found' });
        const hotel = await hotel_model_1.Hotel.findById(room.hotelId);
        if (!hotel)
            return res.status(404).json({ message: 'Hotel not found' });
        // Check authorization - only owner merchant can submit
        const merchantProfile = await merchant_model_1.Merchant.findOne({ userId: user.id });
        if (!merchantProfile || hotel.merchantId.toString() !== merchantProfile._id.toString()) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const updated = await room_model_1.Room.findByIdAndUpdate(id, { $set: { 'auditInfo.status': 'pending' } }, { new: true });
        if (!updated)
            return res.status(404).json({ message: 'Not found' });
        await audit_model_1.AuditLog.create({
            targetType: 'room',
            targetId: updated._id,
            action: 'submit',
            operatorId: user.id,
        });
        // notify admins about pending audit
        const resourceName = updated.baseInfo.type || '房间';
        await notification_service_1.notificationService.notifyAdminsAuditPending('room', updated._id.toString(), resourceName, {
            roomId: updated._id,
            roomType: resourceName,
            hotelId: room.hotelId,
        });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.submitRoom = submitRoom;
const listRoomsForHotel = async (req, res) => {
    const user = req.user;
    const hotelId = req.params.hotelId || req.params.id;
    const { status, search } = req.query;
    const limit = Math.min(parseInt(req.query.limit || '100', 10) || 100, 500);
    const page = Math.max(parseInt(req.query.page || '1', 10) || 1, 1);
    try {
        const hotel = await hotel_model_1.Hotel.findById(hotelId);
        if (!hotel)
            return res.status(404).json({ message: 'Hotel not found' });
        if (user.role !== 'admin') {
            const merchantProfile = await merchant_model_1.Merchant.findOne({ userId: user.id });
            if (!merchantProfile || hotel.merchantId.toString() !== merchantProfile._id.toString()) {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }
        const filter = { hotelId };
        if (status)
            filter['auditInfo.status'] = status;
        if (search)
            filter['baseInfo.type'] = new RegExp(search, 'i');
        const total = await room_model_1.Room.countDocuments(filter);
        const data = await room_model_1.Room.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.json({ data, meta: { total, page, limit } });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.listRoomsForHotel = listRoomsForHotel;
const adminApproveRoom = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const user = req.user;
    try {
        const updated = await room_model_1.Room.findByIdAndUpdate(id, {
            $set: {
                'auditInfo.status': 'approved',
                'auditInfo.auditedBy': user.id,
                'auditInfo.auditedAt': new Date(),
                'auditInfo.rejectReason': undefined,
                'baseInfo.status': 'approved',
            },
        }, { new: true });
        if (!updated)
            return res.status(404).json({ message: 'Not found' });
        await audit_model_1.AuditLog.create({
            targetType: 'room',
            targetId: updated._id,
            action: 'approve',
            operatorId: user.id,
            reason,
        });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.adminApproveRoom = adminApproveRoom;
const adminRejectRoom = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const user = req.user;
    try {
        const updated = await room_model_1.Room.findByIdAndUpdate(id, {
            $set: {
                'auditInfo.status': 'rejected',
                'auditInfo.auditedBy': user.id,
                'auditInfo.auditedAt': new Date(),
                'auditInfo.rejectReason': reason,
                'baseInfo.status': 'rejected',
            },
        }, { new: true });
        if (!updated)
            return res.status(404).json({ message: 'Not found' });
        await audit_model_1.AuditLog.create({
            targetType: 'room',
            targetId: updated._id,
            action: 'reject',
            operatorId: user.id,
            reason,
        });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.adminRejectRoom = adminRejectRoom;
//# sourceMappingURL=room.controller.js.map