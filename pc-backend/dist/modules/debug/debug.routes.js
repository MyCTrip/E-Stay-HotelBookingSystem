"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const merchant_model_1 = require("../merchant/merchant.model");
const debugRouter = (0, express_1.Router)();
// 调试接口：查看所有商户数据
debugRouter.get('/merchants-debug', async (req, res) => {
    try {
        const merchants = await merchant_model_1.Merchant.find()
            .select('_id baseInfo qualificationInfo auditInfo createdAt')
            .limit(5);
        console.log('📊 数据库中的商户记录:');
        merchants.forEach((m, i) => {
            console.log(`\n商户${i + 1}:`, {
                _id: m._id,
                merchantName: m.baseInfo?.merchantName,
                qualificationInfo: m.qualificationInfo,
            });
        });
        res.json({
            message: '调试信息已输出到服务器控制台',
            count: merchants.length,
            merchants: merchants.map(m => ({
                _id: m._id,
                merchantName: m.baseInfo?.merchantName,
                qualificationInfo: m.qualificationInfo,
                auditInfo: m.auditInfo,
            }))
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// 调试接口：创建/更新测试商户数据，包含businessLicensePhoto
debugRouter.post('/merchants-seed', async (req, res) => {
    try {
        const firstMerchant = await merchant_model_1.Merchant.findOne();
        if (!firstMerchant) {
            return res.status(404).json({ message: '没有商户数据可更新' });
        }
        // 更新第一个商户，添加businessLicensePhoto
        firstMerchant.qualificationInfo = {
            businessLicenseNo: '9113010000000012345',
            businessLicensePhoto: '/api/uploads/test-license.jpg',
            idCardNo: '110101199001011234',
            realNameStatus: 'verified'
        };
        firstMerchant.auditInfo = {
            verifyStatus: 'pending',
            rejectReason: undefined
        };
        await firstMerchant.save();
        console.log('✅ 商户数据已更新:');
        console.log('- 商户ID:', firstMerchant._id);
        console.log('- businessLicensePhoto:', firstMerchant.qualificationInfo.businessLicensePhoto);
        res.json({
            message: '测试商户数据已添加',
            merchant: {
                _id: firstMerchant._id,
                merchantName: firstMerchant.baseInfo?.merchantName,
                qualificationInfo: firstMerchant.qualificationInfo,
                auditInfo: firstMerchant.auditInfo
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// 调试接口：清除businessLicensePhoto
debugRouter.post('/merchants-clear-photo', async (req, res) => {
    try {
        const result = await merchant_model_1.Merchant.updateMany({}, { $unset: { 'qualificationInfo.businessLicensePhoto': '' } });
        console.log('✅ businessLicensePhoto已清除，共更新', result.modifiedCount, '条记录');
        res.json({
            message: `已清除${result.modifiedCount}条记录的businessLicensePhoto`,
            modifiedCount: result.modifiedCount
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// 调试接口：检查上传目录
debugRouter.get('/uploads-debug', async (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.resolve(process.cwd(), 'uploads');
    try {
        if (!fs.existsSync(uploadsDir)) {
            return res.json({ message: 'uploads目录不存在', path: uploadsDir });
        }
        const files = fs.readdirSync(uploadsDir);
        console.log(`📁 uploads目录中有 ${files.length} 个文件:`, files);
        res.json({
            message: 'uploads目录存在',
            path: uploadsDir,
            fileCount: files.length,
            files: files.slice(0, 10) // 只返回前10个文件
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = debugRouter;
//# sourceMappingURL=debug.routes.js.map