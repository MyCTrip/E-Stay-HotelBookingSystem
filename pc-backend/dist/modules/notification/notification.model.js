"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    senderType: { type: String, enum: ['admin', 'system'], default: 'system' },
    type: { type: String, enum: ['audit_pending', 'audit_approved', 'audit_rejected', 'update_request'], required: true },
    targetType: { type: String, enum: ['merchant', 'hotel', 'room'], required: true },
    targetId: { type: mongoose_1.Schema.Types.ObjectId, required: true, index: true },
    message: { type: String, required: true },
    meta: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    read: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });
// 组合索引：按用户查询未读通知
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
exports.Notification = (0, mongoose_1.model)('Notification', NotificationSchema);
//# sourceMappingURL=notification.model.js.map