"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const merchant_schema_1 = require("./merchant.schema");
const merchant_controller_1 = require("./merchant.controller");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authenticate, merchant_controller_1.getProfile);
router.post('/', auth_middleware_1.authenticate, (0, validate_middleware_1.validateBody)(merchant_schema_1.merchantCreateSchema), merchant_controller_1.upsertProfile);
router.put('/', auth_middleware_1.authenticate, (0, validate_middleware_1.validateBody)(merchant_schema_1.merchantUpdateSchema), merchant_controller_1.upsertProfile);
router.post('/submit', auth_middleware_1.authenticate, merchant_controller_1.submitProfile);
// 通知相关路由
router.get('/notifications', auth_middleware_1.authenticate, merchant_controller_1.getMerchantNotifications);
router.patch('/notifications/:id/read', auth_middleware_1.authenticate, merchant_controller_1.markMerchantNotificationAsRead);
exports.default = router;
//# sourceMappingURL=merchant.routes.js.map