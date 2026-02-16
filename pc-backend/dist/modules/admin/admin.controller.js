"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRooms = exports.listHotels = exports.listMerchants = exports.markAllNotificationsAsRead = exports.markNotificationAsRead = exports.listNotifications = exports.getProfile = exports.adminRejectRoom = exports.adminApproveDeleteRoom = exports.adminApproveRoom = exports.adminRejectMerchant = exports.adminApproveMerchant = exports.offlineRoom = exports.offlineHotel = exports.adminApproveDeleteHotel = exports.rejectHotel = exports.approveHotel = void 0;
const hotel_model_1 = require("../hotel/hotel.model");
const merchant_model_1 = require("../merchant/merchant.model");
const merchant_service_1 = require("../merchant/merchant.service");
const admin_service_1 = require("./admin.service");
const room_model_1 = require("../room/room.model");
const audit_model_1 = require("../audit/audit.model");
const notification_model_1 = require("../notification/notification.model");
const hotel_service_1 = require("../hotel/hotel.service");
const notification_service_1 = require("../notification/notification.service");
const approveHotel = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const reason = req.body.reason;
    try {
        const hotel = await hotel_model_1.Hotel.findById(id);
        if (!hotel)
            return res.status(404).json({ message: 'Not found' });
        try {
            const applied = await hotel_service_1.hotelService.applyPendingChanges(id, user.id, reason);
            // notify merchant about approval
            const merchant = await merchant_model_1.Merchant.findById(hotel.merchantId);
            if (merchant && merchant.userId) {
                const resourceName = applied.baseInfo.nameCn || '酒店';
                await notification_service_1.notificationService.notifyMerchantAuditApproved(merchant.userId.toString(), 'hotel', applied._id.toString(), resourceName, user.id);
            }
            res.json(applied);
        }
        catch (err) {
            if (err && err.status)
                return res.status(err.status).json({ message: err.message });
            return res.status(400).json({ message: err.message });
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.approveHotel = approveHotel;
const rejectHotel = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const reason = req.body.reason;
    try {
        const hotel = await hotel_model_1.Hotel.findById(id);
        if (!hotel)
            return res.status(404).json({ message: 'Not found' });
        // clear pendingDeletion if present when rejecting
        if (hotel.pendingDeletion) {
            hotel.pendingDeletion = false;
            hotel.auditInfo = { ...hotel.auditInfo, status: 'rejected', auditedBy: user.id, auditedAt: new Date(), rejectReason: reason };
            await hotel.save();
            await audit_model_1.AuditLog.create({
                targetType: 'hotel',
                targetId: hotel._id,
                action: 'reject',
                operatorId: user.id,
                reason,
            });
            // notify merchant about rejection
            const merchant = await merchant_model_1.Merchant.findById(hotel.merchantId);
            if (merchant && merchant.userId) {
                const resourceName = hotel.baseInfo.nameCn || '酒店';
                await notification_service_1.notificationService.notifyMerchantAuditRejected(merchant.userId.toString(), 'hotel', hotel._id.toString(), resourceName, reason || '酒店信息审核未通过', user.id);
            }
            return res.json(hotel);
        }
        const updated = await hotel_model_1.Hotel.findByIdAndUpdate(id, {
            $set: {
                'auditInfo.status': 'rejected',
                'auditInfo.auditedBy': user.id,
                'auditInfo.auditedAt': new Date(),
                'auditInfo.rejectReason': reason,
            },
        }, { new: true });
        if (!updated)
            return res.status(404).json({ message: 'Not found' });
        await audit_model_1.AuditLog.create({
            targetType: 'hotel',
            targetId: updated._id,
            action: 'reject',
            operatorId: user.id,
            reason,
        });
        // notify merchant about rejection
        const merchant = await merchant_model_1.Merchant.findById(hotel.merchantId);
        if (merchant && merchant.userId) {
            const resourceName = updated.baseInfo.nameCn || '酒店';
            await notification_service_1.notificationService.notifyMerchantAuditRejected(merchant.userId.toString(), 'hotel', updated._id.toString(), resourceName, reason || '酒店信息审核未通过', user.id);
        }
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.rejectHotel = rejectHotel;
const adminApproveDeleteHotel = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const user = req.user;
    try {
        try {
            const applied = await hotel_service_1.hotelService.approveDelete(id, user.id, reason);
            return res.json(applied);
        }
        catch (err) {
            if (err && err.status)
                return res.status(err.status).json({ message: err.message });
            return res.status(400).json({ message: err.message });
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.adminApproveDeleteHotel = adminApproveDeleteHotel;
const offlineHotel = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        const hotel = await hotel_model_1.Hotel.findById(id);
        if (!hotel)
            return res.status(404).json({ message: 'Not found' });
        hotel.auditInfo = {
            ...hotel.auditInfo,
            status: 'offline',
            auditedBy: user.id,
            auditedAt: new Date(),
        };
        await hotel.save();
        await audit_model_1.AuditLog.create({
            targetType: 'hotel',
            targetId: hotel._id,
            action: 'offline',
            operatorId: user.id,
        });
        res.json(hotel);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.offlineHotel = offlineHotel;
const offlineRoom = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const { reason } = req.body;
    try {
        const room = await room_model_1.Room.findById(id);
        if (!room)
            return res.status(404).json({ message: 'Not found' });
        room.baseInfo.status = 'offline';
        room.auditInfo = {
            ...room.auditInfo,
            status: 'offline',
            auditedBy: user.id,
            auditedAt: new Date(),
        };
        await room.save();
        await audit_model_1.AuditLog.create({
            targetType: 'room',
            targetId: room._id,
            action: 'offline',
            operatorId: user.id,
            reason,
        });
        res.json(room);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.offlineRoom = offlineRoom;
const adminApproveMerchant = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const user = req.user;
    try {
        const profile = await merchant_service_1.merchantService.setVerifyStatus(id, 'verified', undefined, user.id);
        await audit_model_1.AuditLog.create({
            targetType: 'merchant',
            targetId: profile._id,
            action: 'approve',
            operatorId: user.id,
            reason,
        });
        // notify merchant about approval
        const resourceName = profile.baseInfo.merchantName || '商户资料';
        await notification_service_1.notificationService.notifyMerchantAuditApproved(profile.userId.toString(), 'merchant', profile._id.toString(), resourceName, user.id);
        res.json(profile);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.adminApproveMerchant = adminApproveMerchant;
const adminRejectMerchant = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const user = req.user;
    try {
        const profile = await merchant_service_1.merchantService.setVerifyStatus(id, 'rejected', reason, user.id);
        await audit_model_1.AuditLog.create({
            targetType: 'merchant',
            targetId: profile._id,
            action: 'reject',
            operatorId: user.id,
            reason,
        });
        // notify merchant about rejection
        const resourceName = profile.baseInfo.merchantName || '商户资料';
        await notification_service_1.notificationService.notifyMerchantAuditRejected(profile.userId.toString(), 'merchant', profile._id.toString(), resourceName, reason || '商户资料审核未通过', user.id);
        res.json(profile);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.adminRejectMerchant = adminRejectMerchant;
const adminApproveRoom = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const user = req.user;
    try {
        const room = await room_model_1.Room.findById(id);
        if (!room)
            return res.status(404).json({ message: 'Not found' });
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
            if (room.pendingChanges.bedInfo)
                room.bedInfo = room.pendingChanges.bedInfo;
            if (room.pendingChanges.breakfastInfo) {
                Object.keys(room.pendingChanges.breakfastInfo).forEach((k) => {
                    // @ts-ignore
                    room.breakfastInfo[k] = room.pendingChanges.breakfastInfo[k];
                });
            }
            room.pendingChanges = null;
        }
        room.baseInfo.status = 'approved';
        room.auditInfo = {
            ...room.auditInfo,
            status: 'approved',
            auditedBy: user.id,
            auditedAt: new Date(),
            rejectReason: undefined,
        };
        await room.save();
        await audit_model_1.AuditLog.create({
            targetType: 'room',
            targetId: room._id,
            action: 'approve',
            operatorId: user.id,
            reason,
        });
        // notify merchant about room approval
        const hotel = await hotel_model_1.Hotel.findById(room.hotelId);
        if (hotel) {
            const merchant = await merchant_model_1.Merchant.findById(hotel.merchantId);
            if (merchant && merchant.userId) {
                const resourceName = room.baseInfo.type || '房间';
                await notification_service_1.notificationService.notifyMerchantAuditApproved(merchant.userId.toString(), 'room', room._id.toString(), resourceName, user.id);
            }
        }
        res.json(room);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.adminApproveRoom = adminApproveRoom;
const adminApproveDeleteRoom = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const user = req.user;
    try {
        const room = await room_model_1.Room.findById(id);
        if (!room)
            return res.status(404).json({ message: 'Not found' });
        if (!room.pendingDeletion)
            return res.status(400).json({ message: 'No pending delete request' });
        room.pendingDeletion = false;
        room.deletedAt = new Date();
        room.auditInfo = {
            ...room.auditInfo,
            status: 'offline',
            auditedBy: user.id,
            auditedAt: new Date(),
        };
        await room.save();
        await audit_model_1.AuditLog.create({
            targetType: 'room',
            targetId: room._id,
            action: 'delete',
            operatorId: user.id,
            reason,
        });
        res.json(room);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.adminApproveDeleteRoom = adminApproveDeleteRoom;
const adminRejectRoom = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const user = req.user;
    try {
        const room = await room_model_1.Room.findById(id);
        if (!room)
            return res.status(404).json({ message: 'Not found' });
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
        // notify merchant about room rejection
        const hotel = await hotel_model_1.Hotel.findById(room.hotelId);
        if (hotel) {
            const merchant = await merchant_model_1.Merchant.findById(hotel.merchantId);
            if (merchant && merchant.userId) {
                const resourceName = room.baseInfo.type || '房间';
                await notification_service_1.notificationService.notifyMerchantAuditRejected(merchant.userId.toString(), 'room', room._id.toString(), resourceName, reason || '房间信息审核未通过', user.id);
            }
        }
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.adminRejectRoom = adminRejectRoom;
const getProfile = async (req, res) => {
    const user = req.user;
    try {
        const profile = await admin_service_1.adminService.findByUserId(user.id);
        if (!profile)
            return res.status(404).json({ message: 'Not found' });
        res.json(profile);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.getProfile = getProfile;
const listNotifications = async (req, res) => {
    const user = req.user;
    const { read, type, limit = 20, page = 1 } = req.query;
    try {
        const filter = { userId: user.id };
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
        const total = await notification_model_1.Notification.countDocuments(filter);
        const data = await notification_model_1.Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);
        // 获取未读通知数
        const unreadCount = await notification_service_1.notificationService.getUnreadCount(user.id);
        res.json({ data, meta: { total, page: pageNum, limit: limitNum, unreadCount } });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.listNotifications = listNotifications;
/**
 * 标记单个通知为已读
 */
const markNotificationAsRead = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        const notification = await notification_model_1.Notification.findById(id);
        if (!notification)
            return res.status(404).json({ message: 'Not found' });
        if (notification.userId.toString() !== user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const updated = await notification_service_1.notificationService.markAsRead(id);
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
/**
 * 标记所有通知为已读
 */
const markAllNotificationsAsRead = async (req, res) => {
    const user = req.user;
    try {
        await notification_model_1.Notification.updateMany({ userId: user.id, read: false }, { read: true });
        res.json({ message: 'All notifications marked as read' });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.markAllNotificationsAsRead = markAllNotificationsAsRead;
const listMerchants = async (req, res) => {
    const { status, search } = req.query;
    const limit = Math.min(parseInt(req.query.limit || '100', 10) || 100, 500);
    const page = Math.max(parseInt(req.query.page || '1', 10) || 1, 1);
    const filter = {};
    if (status)
        filter['auditInfo.verifyStatus'] = status;
    if (search)
        filter['baseInfo.merchantName'] = new RegExp(search, 'i');
    const total = await merchant_model_1.Merchant.find(filter).countDocuments();
    const data = await merchant_model_1.Merchant.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    res.json({ data, meta: { total, page, limit } });
};
exports.listMerchants = listMerchants;
const listHotels = async (req, res) => {
    const { status, search, merchantId, propertyType } = req.query;
    const limit = Math.min(parseInt(req.query.limit || '100', 10) || 100, 500);
    const page = Math.max(parseInt(req.query.page || '1', 10) || 1, 1);
    const filter = {};
    if (status)
        filter['auditInfo.status'] = status;
    if (merchantId)
        filter['merchantId'] = merchantId;
    if (propertyType)
        filter['baseInfo.propertyType'] = propertyType; // 新增
    if (search)
        filter.$or = [
            { 'baseInfo.nameCn': new RegExp(search, 'i') },
            { 'baseInfo.nameEn': new RegExp(search, 'i') },
        ];
    const total = await hotel_model_1.Hotel.find(filter).countDocuments();
    const data = await hotel_model_1.Hotel.find(filter)
        .populate({
        path: 'merchantId',
        select: 'baseInfo.merchantName',
    })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    res.json({ data, meta: { total, page, limit } });
};
exports.listHotels = listHotels;
const listRooms = async (req, res) => {
    const { status, search, hotelId } = req.query;
    const limit = Math.min(parseInt(req.query.limit || '100', 10) || 100, 500);
    const page = Math.max(parseInt(req.query.page || '1', 10) || 1, 1);
    const filter = {};
    if (status)
        filter['auditInfo.status'] = status;
    if (hotelId)
        filter['hotelId'] = hotelId;
    if (search)
        filter['baseInfo.type'] = new RegExp(search, 'i');
    const total = await room_model_1.Room.find(filter).countDocuments();
    const data = await room_model_1.Room.find(filter)
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
exports.listRooms = listRooms;
//# sourceMappingURL=admin.controller.js.map