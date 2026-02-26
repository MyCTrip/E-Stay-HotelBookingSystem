"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merchantService = void 0;
const merchant_model_1 = require("./merchant.model");
exports.merchantService = {
    findByUserId: async (userId) => {
        return merchant_model_1.Merchant.findOne({ userId });
    },
    upsertByUserId: async (userId, payload) => {
        // 1. 构建 MongoDB 底层的更新指令对象
        const updateData = {
            // 核心业务逻辑：只要有更新，强制把状态打回草稿
            'auditInfo.verifyStatus': 'unverified'
        };
        // 2. 将前端传来的嵌套对象，拆解成 MongoDB 认识的点语法 (dot notation)
        // 这样可以直接精准修改某个字段，绝对不会被 Mongoose 丢弃
        if (payload.baseInfo) {
            Object.keys(payload.baseInfo).forEach(key => {
                updateData[`baseInfo.${key}`] = payload.baseInfo[key];
            });
        }
        if (payload.qualificationInfo) {
            Object.keys(payload.qualificationInfo).forEach(key => {
                updateData[`qualificationInfo.${key}`] = payload.qualificationInfo[key];
            });
        }
        // { new: true } 保证返回修改后的最新数据
        // { upsert: true } 保证如果这个用户是第一次填资料，就自动帮他新建一条
        const updatedProfile = await merchant_model_1.Merchant.findOneAndUpdate({ userId }, {
            $set: updateData,
            $unset: { 'auditInfo.rejectReason': 1 } // 顺手抹除以前可能留下的驳回原因
        }, { new: true, upsert: true });
        return updatedProfile;
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