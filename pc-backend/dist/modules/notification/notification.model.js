"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'AdminProfile', required: true, index: true },
    message: { type: String, required: true },
    meta: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    read: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });
exports.Notification = (0, mongoose_1.model)('Notification', NotificationSchema);
//# sourceMappingURL=notification.model.js.map