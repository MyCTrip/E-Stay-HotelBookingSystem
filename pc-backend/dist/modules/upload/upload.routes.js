"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("./upload.controller");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// POST /api/upload  单图片上传，字段名 file
router.post('/', auth_middleware_1.authenticate, (0, upload_middleware_1.singleImageUpload)('file'), upload_controller_1.uploadImage);
exports.default = router;
//# sourceMappingURL=upload.routes.js.map