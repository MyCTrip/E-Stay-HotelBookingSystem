"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireMerchantVerified = void 0;
const merchant_model_1 = require("../modules/merchant/merchant.model");
const requireMerchantVerified = async (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const profile = await merchant_model_1.Merchant.findOne({ userId: req.user.id });
        if (!profile)
            return res.status(403).json({ message: 'Merchant profile missing' });
        if (profile.auditInfo?.verifyStatus !== 'verified')
            return res.status(403).json({ message: 'Merchant not verified' });
        next();
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.requireMerchantVerified = requireMerchantVerified;
//# sourceMappingURL=merchant.middleware.js.map