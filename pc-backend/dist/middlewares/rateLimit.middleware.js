"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitApi = exports.rateLimitRegister = exports.rateLimitLogin = exports.rateLimit = void 0;
const redis_1 = require("../config/redis");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * API请求频率限制中间件
 * @param options 频率限制选项
 * @returns 中间件函数
 */
const rateLimit = (options) => {
    const { windowMs, max, message = '请求过于频繁，请稍后再试', skip } = options;
    return async (req, res, next) => {
        // 跳过限制的条件
        if (skip && skip(req)) {
            return next();
        }
        // 获取客户端IP和用户ID
        const ip = req.ip || req.connection.remoteAddress || '';
        const userId = req.user?.id || req.user?._id || 'anonymous';
        // 生成Redis键
        const key = `rate_limit:${ip}:${userId}:${req.path}`;
        try {
            // 检查Redis是否可用
            if (!redis_1.redisClient || !redis_1.redisClient.isReady) {
                // Redis不可用时，跳过频率限制
                logger_1.default.warn('Redis不可用，跳过频率限制');
                return next();
            }
            // 获取当前请求计数
            const current = await redis_1.redisClient.get(key);
            if (current) {
                const count = parseInt(current, 10);
                if (count >= max) {
                    return res.status(429).json({
                        status: 'error',
                        message,
                        errors: { rateLimit: message }
                    });
                }
                // 增加计数
                await redis_1.redisClient.incr(key);
            }
            else {
                // 设置初始计数和过期时间
                await redis_1.redisClient.set(key, '1', { EX: Math.ceil(windowMs / 1000) });
            }
            next();
        }
        catch (error) {
            // Redis操作失败时，跳过频率限制
            logger_1.default.error('频率限制中间件错误:', error);
            next();
        }
    };
};
exports.rateLimit = rateLimit;
/**
 * 登录接口的频率限制（更严格）
 */
exports.rateLimitLogin = (0, exports.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 5, // 最多5次请求
    message: '登录尝试过于频繁，请15分钟后再试',
    skip: (req) => req.method !== 'POST'
});
/**
 * 注册接口的频率限制
 */
exports.rateLimitRegister = (0, exports.rateLimit)({
    windowMs: 60 * 60 * 1000, // 1小时
    max: 3, // 最多3次请求
    message: '注册尝试过于频繁，请1小时后再试',
    skip: (req) => req.method !== 'POST'
});
/**
 * 通用API接口的频率限制
 */
exports.rateLimitApi = (0, exports.rateLimit)({
    windowMs: 60 * 1000, // 1分钟
    max: 60, // 最多60次请求
    message: '请求过于频繁，请稍后再试'
});
//# sourceMappingURL=rateLimit.middleware.js.map