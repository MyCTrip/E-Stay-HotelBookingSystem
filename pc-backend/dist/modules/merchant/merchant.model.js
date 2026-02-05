"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Merchant = void 0;
const mongoose_1 = require("mongoose");
const BaseInfoSchema = new mongoose_1.Schema({
    merchantName: { type: String, required: true },
    contactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, required: true },
});
const QualificationSchema = new mongoose_1.Schema({
    businessLicenseNo: { type: String, unique: true, sparse: true },
    idCardNo: { type: String, unique: true, sparse: true },
    realNameStatus: {
        type: String,
        enum: ['unverified', 'verified', 'rejected'],
        default: 'unverified',
    },
});
const AuditSchema = new mongoose_1.Schema({
    verifyStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified', 'rejected'],
        default: 'unverified',
    },
    rejectReason: String,
});
const MerchantSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    baseInfo: { type: BaseInfoSchema, required: true },
    qualificationInfo: { type: QualificationSchema, default: {} },
    auditInfo: { type: AuditSchema, default: {} },
}, { timestamps: true });
exports.Merchant = (0, mongoose_1.model)('MerchantProfile', MerchantSchema);
//# sourceMappingURL=merchant.model.js.map