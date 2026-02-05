"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRejectMerchant = exports.adminApproveMerchant = exports.submitProfile = exports.upsertProfile = exports.getProfile = void 0;
const merchant_service_1 = require("./merchant.service");
const audit_model_1 = require("../audit/audit.model");
const getProfile = async (req, res) => {
    const user = req.user;
    const profile = await merchant_service_1.merchantService.findByUserId(user.id);
    if (!profile)
        return res.status(404).json({ message: 'Not found' });
    res.json(profile);
};
exports.getProfile = getProfile;
const upsertProfile = async (req, res) => {
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
        // return fresh doc
        const fresh = await merchant_service_1.merchantService.findById(profile._id.toString());
        res.json(fresh);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.submitProfile = submitProfile;
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