"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merchantService = void 0;
const merchant_model_1 = require("./merchant.model");
exports.merchantService = {
    findByUserId: async (userId) => {
        return merchant_model_1.Merchant.findOne({ userId });
    },
    upsertByUserId: async (userId, payload) => {
        const existing = await merchant_model_1.Merchant.findOne({ userId });
        if (existing) {
            existing.baseInfo = { ...existing.baseInfo, ...payload.baseInfo };
            if (payload.qualificationInfo)
                existing.qualificationInfo = {
                    ...existing.qualificationInfo,
                    ...payload.qualificationInfo,
                };
            await existing.save();
            return existing;
        }
        const created = await merchant_model_1.Merchant.create({
            userId,
            baseInfo: payload.baseInfo,
            qualificationInfo: payload.qualificationInfo || {},
        });
        return created;
    },
    submitByUserId: async (userId) => {
        const profile = await merchant_model_1.Merchant.findOneAndUpdate({ userId }, { $set: { 'auditInfo.verifyStatus': 'pending' } }, { new: true });
        if (!profile)
            throw new Error('Merchant profile not found');
        return profile;
    },
    findById: async (id) => {
        return merchant_model_1.Merchant.findById(id);
    },
    setVerifyStatus: async (id, status, reason, adminId) => {
        const update = { 'auditInfo.verifyStatus': status };
        if (reason)
            update['auditInfo.rejectReason'] = reason;
        const profile = await merchant_model_1.Merchant.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (!profile)
            throw new Error('Not found');
        return profile;
    },
};
//# sourceMappingURL=merchant.service.js.map