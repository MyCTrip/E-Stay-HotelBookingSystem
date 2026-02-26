"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_middleware_1 = require("./middlewares/error.middleware");
const rateLimiter_middleware_1 = require("./middlewares/rateLimiter.middleware");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const merchant_routes_1 = __importDefault(require("./modules/merchant/merchant.routes"));
const hotel_routes_1 = __importDefault(require("./modules/hotel/hotel.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const audit_routes_1 = __importDefault(require("./modules/audit/audit.routes"));
const room_routes_1 = __importDefault(require("./modules/room/room.routes"));
const upload_routes_1 = __importDefault(require("./modules/upload/upload.routes"));
const upload_1 = require("./config/upload");
dotenv_1.default.config();
const app = (0, express_1.default)();
// 基础中间件
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174',
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin || '*');
        }
        else if (process.env.NODE_ENV === 'production') {
            callback(new Error('CORS not allowed'));
        }
        else {
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// ⭐ 优先级 1: 静态文件服务（必须在 rateLimit 前）
app.use('/api/uploads', express_1.default.static(upload_1.UPLOAD_DIR));
// ⭐ 优先级 2: 上传路由（必须在 rateLimit 前）
app.use('/api/upload', upload_routes_1.default);
// ⭐ 优先级 3: 频率限制（其他 API 的限制）
app.use('/api', (0, rateLimiter_middleware_1.rateLimit)());
// ⭐ 优先级 4: 其他 API 路由
app.use('/api/auth', auth_routes_1.default);
app.use('/api/merchants', merchant_routes_1.default);
app.use('/api/hotels', hotel_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/admin', audit_routes_1.default);
app.use('/api', room_routes_1.default);
// 错误处理
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map