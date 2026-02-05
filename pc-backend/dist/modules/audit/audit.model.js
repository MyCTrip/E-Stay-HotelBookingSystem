"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
const mongoose_1 = require("mongoose");
const AuditSchema = new mongoose_1.Schema({
    targetType: { type: String, enum: ['hotel', 'merchant', 'room'], required: true },
    targetId: { type: mongoose_1.Schema.Types.ObjectId, required: true, index: true },
    // actions to track resource lifecycle and requests
    action: { type: String, enum: ['submit', 'approve', 'reject', 'offline', 'update_request', 'delete_request', 'delete'], required: true },
    operatorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'AdminProfile', required: true, index: true },
    reason: String,
}, { timestamps: { createdAt: true, updatedAt: false } });
exports.AuditLog = (0, mongoose_1.model)('AuditLog', AuditSchema);
//# sourceMappingURL=audit.model.js.map