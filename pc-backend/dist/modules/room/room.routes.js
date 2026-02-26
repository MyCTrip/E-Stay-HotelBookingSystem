"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const merchant_middleware_1 = require("../../middlewares/merchant.middleware");
const hotel_middleware_1 = require("../../middlewares/hotel.middleware");
const room_controller_1 = require("./room.controller");
const room_schema_1 = require("./room.schema");
const router = (0, express_1.Router)();
// 商户在酒店已通过审核情况下创建房间
router.post('/hotels/:hotelId/rooms', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('merchant'), merchant_middleware_1.requireMerchantVerified, hotel_middleware_1.requireHotelApproved, (0, validate_middleware_1.validateBody)(room_schema_1.createRoomSchema), room_controller_1.createRoom);
// 商户获取某个酒店下的房型列表（仅 owner 可访问）
router.get('/hotels/:hotelId/rooms', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('merchant'), merchant_middleware_1.requireMerchantVerified, room_controller_1.listRoomsForHotel);
router.put('/rooms/:id', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('merchant'), room_controller_1.updateRoom);
router.post('/rooms/:id/submit', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('merchant'), room_controller_1.submitRoom);
router.post('/rooms/:id/delete-request', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('merchant'), room_controller_1.requestDeleteRoom);
exports.default = router;
//# sourceMappingURL=room.routes.js.map