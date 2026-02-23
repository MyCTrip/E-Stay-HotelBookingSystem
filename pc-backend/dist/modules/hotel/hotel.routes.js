"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const cache_middleware_1 = require("../../middlewares/cache.middleware");
const hotel_controller_1 = require("./hotel.controller");
const hotel_schema_1 = require("./hotel.schema");
const merchant_middleware_1 = require("../../middlewares/merchant.middleware");
const router = (0, express_1.Router)();
// 创建酒店仅允许商户且必须为已通过商户
router.post('/', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('merchant'), merchant_middleware_1.requireMerchantVerified, (0, validate_middleware_1.validateBody)(hotel_schema_1.createHotelSchema), hotel_controller_1.createHotel);
// 商户获取自己创建的酒店列表
router.get('/my', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('merchant'), merchant_middleware_1.requireMerchantVerified, hotel_controller_1.listMyHotels);
// 更新允许商户更新自身或管理员更新审核信息（控制逻辑在 controller）
router.put('/:id', auth_middleware_1.authenticate, (0, validate_middleware_1.validateBody)(hotel_schema_1.updateHotelSchema), hotel_controller_1.updateHotel);
// 提交审核仅允许商户且商户必须已通过
router.post('/:id/submit', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('merchant'), merchant_middleware_1.requireMerchantVerified, hotel_controller_1.submitHotel);
// 商户发起删除请求（不立即物理删除）
router.post('/:id/delete-request', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('merchant'), merchant_middleware_1.requireMerchantVerified, hotel_controller_1.requestDeleteHotel);
// 获取已审核通过的酒店列表（支持分页和筛选）
router.get('/', (0, cache_middleware_1.cache)({ expiration: 300, keyPrefix: 'hotel:' }), hotel_controller_1.listApprovedHotels);
// 获取热门酒店
router.get('/hot', (0, cache_middleware_1.cache)({ expiration: 3600, keyPrefix: 'hotel:' }), hotel_controller_1.getHotHotels);
// 获取城市列表
router.get('/cities', (0, cache_middleware_1.cache)({ expiration: 86400, keyPrefix: 'hotel:' }), hotel_controller_1.getCities);
exports.default = router;
//# sourceMappingURL=hotel.routes.js.map