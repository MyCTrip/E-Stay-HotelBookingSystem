"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRejectMerchant = exports.adminApproveMerchant = exports.markMerchantNotificationAsRead = exports.getMerchantNotifications = exports.submitProfile = exports.upsertProfile = exports.getProfile = void 0;
const merchant_service_1 = require("./merchant.service");
const audit_model_1 = require("../audit/audit.model");
const notification_service_1 = require("../notification/notification.service");
const notification_model_1 = require("../notification/notification.model");
const getProfile = async (req, res) => {
    const user = req.user;
    const profile = await merchant_service_1.merchantService.findByUserId(user.id);
    if (!profile)
        return res.status(404).json({ message: 'Not found' });
    res.json(profile);
};
exports.getProfile = getProfile;
const upsertProfile = async (req, res) => {
    console.log('upsertProfile hit', req.body);
    const user = req.user;
    try {
        const profile = await merchant_service_1.merchantService.upsertByUserId(user.id, req.body);
        res.json(profile);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.upsertProfile = upsertProfile;
const submitProfile = async (req, res) => {
    const user = req.user;
    try {
        const profile = await merchant_service_1.merchantService.submitByUserId(user.id);
        // write audit log (operatorId == user submitting)
        await audit_model_1.AuditLog.create({
            targetType: 'merchant',
            targetId: profile._id,
            action: 'submit',
            operatorId: user.id,
        });
        // notify admins about pending audit
        const resourceName = profile.baseInfo.merchantName || '商户资料';
        await notification_service_1.notificationService.notifyAdminsAuditPending('merchant', profile._id.toString(), resourceName, {
            merchantId: profile._id,
            merchantName: resourceName,
        });
        // return fresh doc
        const fresh = await merchant_service_1.merchantService.findById(profile._id.toString());
        res.json(fresh);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.submitProfile = submitProfile;
/**
 * 获取商户的通知列表（审核反馈）
 */
const getMerchantNotifications = async (req, res) => {
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
        const unreadCount = await notification_model_1.Notification.countDocuments({ userId: user.id, read: false });
        res.json({ data, meta: { total, page: pageNum, limit: limitNum, unreadCount } });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.getMerchantNotifications = getMerchantNotifications;
/**
 * 标记商户通知为已读
 */
const markMerchantNotificationAsRead = async (req, res) => {
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
exports.markMerchantNotificationAsRead = markMerchantNotificationAsRead;
const adminApproveMerchant = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const user = req.user; // admin
    try {
        const profile = await merchant_service_1.merchantService.setVerifyStatus(id, 'verified');
        await audit_model_1.AuditLog.create({
            targetType: 'merchant',
            targetId: profile._id,
            action: 'approve',
            operatorId: user.id,
            reason,
        });
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
    const user = req.user; // admin
    try {
        const profile = await merchant_service_1.merchantService.setVerifyStatus(id, 'rejected', reason);
        await audit_model_1.AuditLog.create({
            targetType: 'merchant',
            targetId: profile._id,
            action: 'reject',
            operatorId: user.id,
            reason,
        });
        res.json(profile);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.adminRejectMerchant = adminRejectMerchant;
//# sourceMappingURL=merchant.controller.js.map