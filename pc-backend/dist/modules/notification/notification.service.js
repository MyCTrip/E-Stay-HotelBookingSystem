"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const admin_model_1 = require("../admin/admin.model");
const notification_model_1 = require("./notification.model");
exports.notificationService = {
    /**
     * 通知所有管理员 - 用于商户提交审核时
     */
    notifyAdminsAuditPending: async (targetType, targetId, resourceName, meta) => {
        const admins = await admin_model_1.AdminProfile.find().select('userId').lean();
        const created = [];
        const messageMap = {
            merchant: `商户资料「${resourceName}」已提交审核，请及时处理`,
            hotel: `酒店「${resourceName}」已提交审核，请及时处理`,
            room: `房间「${resourceName}」已提交审核，请及时处理`,
        };
        for (const admin of admins) {
            const notification = await notification_model_1.Notification.create({
                userId: admin.userId,
                senderType: 'system',
                type: 'audit_pending',
                targetType,
                targetId,
                message: messageMap[targetType] || '有新的审核待处理',
                meta: { resourceName, ...meta },
            });
            created.push(notification);
        }
        return created;
    },
    /**
     * 通知商户 - 审核通过
     */
    notifyMerchantAuditApproved: async (merchantUserId, targetType, targetId, resourceName, operatorId, meta) => {
        const messageMap = {
            merchant: `您的资料「${resourceName}」已通过审核，已可正常使用`,
            hotel: `您的酒店「${resourceName}」已通过审核，已发布在线`,
            room: `您的房间「${resourceName}」已通过审核，已发布在线`,
        };
        return notification_model_1.Notification.create({
            userId: merchantUserId,
            senderType: 'admin',
            type: 'audit_approved',
            targetType,
            targetId,
            message: messageMap[targetType] || '审核已通过',
            meta: { resourceName, operatorId, ...meta },
        });
    },
    /**
     * 通知商户 - 审核驳回
     */
    notifyMerchantAuditRejected: async (merchantUserId, targetType, targetId, resourceName, reason, operatorId, meta) => {
        const messageMap = {
            merchant: `您的资料「${resourceName}」审核未通过`,
            hotel: `您的酒店「${resourceName}」审核未通过`,
            room: `您的房间「${resourceName}」审核未通过`,
        };
        return notification_model_1.Notification.create({
            userId: merchantUserId,
            senderType: 'admin',
            type: 'audit_rejected',
            targetType,
            targetId,
            message: messageMap[targetType] || '审核未通过',
            meta: { resourceName, reason, operatorId, ...meta },
        });
    },
    /**
     * 通知所有管理员 - 更新请求（用于商户修改已审批的数据）
     */
    notifyAdminsUpdateRequest: async (targetType, targetId, resourceName, meta) => {
        const admins = await admin_model_1.AdminProfile.find().select('userId').lean();
        const created = [];
        const messageMap = {
            hotel: `酒店「${resourceName}」有更新待审核`,
            room: `房间「${resourceName}」有更新待审核`,
        };
        for (const admin of admins) {
            const notification = await notification_model_1.Notification.create({
                userId: admin.userId,
                senderType: 'system',
                type: 'update_request',
                targetType,
                targetId,
                message: messageMap[targetType] || '有更新待审核',
                meta: { resourceName, ...meta },
            });
            created.push(notification);
        }
        return created;
    },
    /**
     * 标记通知为已读
     */
    markAsRead: async (notificationId) => {
        return notification_model_1.Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
    },
    /**
     * 标记多个通知为已读
     */
    markMultipleAsRead: async (notificationIds) => {
        return notification_model_1.Notification.updateMany({ _id: { $in: notificationIds } }, { read: true });
    },
    /**
     * 获取用户未读通知数
     */
    getUnreadCount: async (userId) => {
        return notification_model_1.Notification.countDocuments({ userId, read: false });
    },
    /**
     * 旧方法兼容：通知所有管理员
     */
    notifyAdmins: async (message, meta) => {
        const admins = await admin_model_1.AdminProfile.find().select('userId').lean();
        const created = [];
        for (const admin of admins) {
            const n = await notification_model_1.Notification.create({
                userId: admin.userId,
                senderType: 'system',
                type: 'audit_pending',
                targetType: 'merchant',
                targetId: meta?.targetId || new (require('mongoose')).Types.ObjectId(),
                message,
                meta,
            });
            created.push(n);
        }
        return created;
    },
};
//# sourceMappingURL=notification.service.js.map