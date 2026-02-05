"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const audit_model_1 = require("./audit.model");
const router = (0, express_1.Router)();
router.get('/audit-logs', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), async (req, res) => {
    // Supported query params: targetType, action, operatorId, startDate, endDate, limit, page
    const { targetType, action, operatorId, startDate, endDate } = req.query;
    let limit = Math.min(parseInt(req.query.limit || '100', 10) || 100, 500);
    const page = Math.max(parseInt(req.query.page || '1', 10) || 1, 1);
    const filter = {};
    if (targetType)
        filter.targetType = targetType;
    if (action)
        filter.action = action;
    if (operatorId)
        filter.operatorId = operatorId;
    if (startDate || endDate)
        filter.createdAt = {};
    if (startDate)
        filter.createdAt.$gte = new Date(startDate);
    if (endDate)
        filter.createdAt.$lte = new Date(endDate);
    const total = await audit_model_1.AuditLog.countDocuments(filter);
    const data = await audit_model_1.AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    res.json({ data, meta: { total, page, limit } });
});
exports.default = router;
//# sourceMappingURL=audit.routes.js.map