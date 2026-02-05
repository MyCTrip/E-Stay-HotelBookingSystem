"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceError = exports.hotelService = void 0;
const hotel_model_1 = require("./hotel.model");
const audit_model_1 = require("../audit/audit.model");
const notification_service_1 = require("../notification/notification.service");
class ServiceError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}
exports.ServiceError = ServiceError;
exports.hotelService = {
    createHotel: async (merchantId, baseInfo, checkinInfo) => {
        const hotel = await hotel_model_1.Hotel.create({ merchantId, baseInfo, checkinInfo: checkinInfo || {} });
        return hotel;
    },
    checkOptimisticVersion: (hotel, payload) => {
        if (!hotel)
            throw new ServiceError('Not found', 404);
        if (payload.__v !== undefined && payload.__v !== hotel.__v) {
            throw new ServiceError('Version conflict', 409);
        }
        if (payload.updatedAt && new Date(payload.updatedAt).getTime() !== new Date(hotel.updatedAt).getTime()) {
            throw new ServiceError('Version conflict', 409);
        }
    },
    savePendingChanges: async (hotelId, merchantId, diffs) => {
        const hotel = await hotel_model_1.Hotel.findById(hotelId);
        if (!hotel)
            throw new ServiceError('Not found', 404);
        if (hotel.merchantId.toString() !== merchantId)
            throw new ServiceError('Forbidden', 403);
        hotel.pendingChanges = { ...(hotel.pendingChanges || {}), ...diffs };
        hotel.auditInfo = hotel.auditInfo || {};
        // @ts-ignore
        hotel.auditInfo.status = 'pending';
        // @ts-ignore
        hotel.auditInfo.auditedBy = null;
        // @ts-ignore
        hotel.auditInfo.auditedAt = null;
        hotel.markModified('auditInfo');
        hotel.markModified('pendingChanges');
        await hotel.save();
        const log = await audit_model_1.AuditLog.create({
            targetType: 'hotel',
            targetId: hotel._id,
            action: 'update_request',
            operatorId: merchantId,
        });
        await notification_service_1.notificationService.notifyAdmins(`Hotel update requested: ${hotel._id}`, { auditId: log._id, type: 'update_request' });
        return hotel;
    },
    requestDelete: async (hotelId, merchantId) => {
        const hotel = await hotel_model_1.Hotel.findById(hotelId);
        if (!hotel)
            throw new ServiceError('Not found', 404);
        if (hotel.merchantId.toString() !== merchantId)
            throw new ServiceError('Forbidden', 403);
        hotel.pendingDeletion = true;
        hotel.auditInfo = hotel.auditInfo || {};
        // @ts-ignore
        hotel.auditInfo.status = 'pending';
        hotel.markModified('auditInfo');
        hotel.markModified('pendingDeletion');
        await hotel.save();
        const log = await audit_model_1.AuditLog.create({ targetType: 'hotel', targetId: hotel._id, action: 'delete_request', operatorId: merchantId });
        await notification_service_1.notificationService.notifyAdmins(`Hotel delete requested: ${hotel._id}`, { auditId: log._id, type: 'delete_request' });
        return hotel;
    },
    applyPendingChanges: async (hotelId, adminId, reason) => {
        const hotel = await hotel_model_1.Hotel.findById(hotelId);
        if (!hotel)
            throw new ServiceError('Not found', 404);
        // apply baseInfo and checkinInfo diffs if present
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
        hotel.auditInfo = hotel.auditInfo || {};
        // @ts-ignore
        hotel.auditInfo.status = 'approved';
        // @ts-ignore
        hotel.auditInfo.auditedBy = adminId;
        // @ts-ignore
        hotel.auditInfo.auditedAt = new Date();
        hotel.markModified('auditInfo');
        await hotel.save();
        await audit_model_1.AuditLog.create({ targetType: 'hotel', targetId: hotel._id, action: 'approve', operatorId: adminId, reason });
        return hotel;
    },
    approveDelete: async (hotelId, adminId, reason) => {
        const hotel = await hotel_model_1.Hotel.findById(hotelId);
        if (!hotel)
            throw new ServiceError('Not found', 404);
        if (!hotel.pendingDeletion)
            throw new ServiceError('No pending delete request', 400);
        hotel.pendingDeletion = false;
        hotel.deletedAt = new Date();
        hotel.auditInfo = hotel.auditInfo || {};
        // @ts-ignore
        hotel.auditInfo.status = 'offline';
        // @ts-ignore
        hotel.auditInfo.auditedBy = adminId;
        // @ts-ignore
        hotel.auditInfo.auditedAt = new Date();
        hotel.markModified('auditInfo');
        hotel.markModified('pendingDeletion');
        hotel.markModified('deletedAt');
        await hotel.save();
        await audit_model_1.AuditLog.create({ targetType: 'hotel', targetId: hotel._id, action: 'delete', operatorId: adminId, reason });
        return hotel;
    },
    rejectPending: async (hotelId, adminId, reason) => {
        const hotel = await hotel_model_1.Hotel.findById(hotelId);
        if (!hotel)
            throw new ServiceError('Not found', 404);
        hotel.pendingDeletion = false;
        hotel.auditInfo = hotel.auditInfo || {};
        // @ts-ignore
        hotel.auditInfo.status = 'rejected';
        // @ts-ignore
        hotel.auditInfo.auditedBy = adminId;
        // @ts-ignore
        hotel.auditInfo.auditedAt = new Date();
        // @ts-ignore
        hotel.auditInfo.rejectReason = reason;
        hotel.markModified('auditInfo');
        hotel.markModified('pendingDeletion');
        await hotel.save();
        await audit_model_1.AuditLog.create({ targetType: 'hotel', targetId: hotel._id, action: 'reject', operatorId: adminId, reason });
        return hotel;
    },
};
//# sourceMappingURL=hotel.service.js.map