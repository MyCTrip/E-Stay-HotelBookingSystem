"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRateLimit = exports.loginRateLimit = exports.sensitiveRateLimit = exports.rateLimit = void 0;
const redis_1 = require("../config/redis");
// 内存存储，作为Redis不可用时的后备
class MemoryStore {
    constructor() {
        this.store = new Map();
    }
    async get(key) {
        const item = this.store.get(key);
        if (item && Date.now() > item.resetTime) {
            this.store.delete(key);
            return undefined;
        }
        return item;
    }
    async set(key, value, ttl) {
        const resetTime = Date.now() + ttl;
        this.store.set(key, {
            count: value,
            resetTime,
        });
    }
    async increment(key) {
        const item = await this.get(key);
        if (item) {
            item.count += 1;
            this.store.set(key, item);
            return item.count;
        }
        return 1;
    }
}
// 创建内存存储实例
const memoryStore = new MemoryStore();
// 默认限制配置
const defaultConfig = {
    windowMs: 60 * 1000, // 1分钟
    max: 60, // 每分钟60次请求
    message: 'Too many requests, please try again later.',
    headers: true,
};
// 敏感接口限制配置
const sensitiveConfig = {
    windowMs: 60 * 1000, // 1分钟
    max: 10, // 每分钟10次请求
    message: 'Too many requests for sensitive endpoint, please try again later.',
    headers: true,
};
// 获取客户端IP地址
const getClientIP = (req) => {
    return (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.ip ||
        'unknown');
};
// 生成限制键
const generateKey = (req, prefix) => {
    const ip = getClientIP(req);
    const userId = req.user?.id || req.user?.userId || 'anonymous';
    return `${prefix}:${ip}:${userId}`;
};
// 频率限制中间件
const rateLimit = (config = {}) => {
    const mergedConfig = { ...defaultConfig, ...config };
    return async (req, res, next) => {
        try {
            const key = generateKey(req, 'rate_limit');
            let current = 0;
            let resetTime = Date.now() + mergedConfig.windowMs;
            // 检查Redis是否可用
            if ((0, redis_1.isRedisConnected)()) {
                const redisClient = (0, redis_1.getRedisClient)();
                if (redisClient) {
                    // 使用Redis进行限制
                    const exists = await redisClient.exists(key);
                    if (exists) {
                        // 增加计数
                        current = await redisClient.incr(key);
                    }
                    else {
                        // 设置初始值和过期时间
                        current = 1;
                        await redisClient.set(key, current, { EX: Math.ceil(mergedConfig.windowMs / 1000) });
                    }
                }
                else {
                    // Redis客户端不可用，使用内存存储
                    const item = await memoryStore.get(key);
                    if (item) {
                        current = await memoryStore.increment(key);
                        resetTime = item.resetTime;
                    }
                    else {
                        current = 1;
                        await memoryStore.set(key, current, mergedConfig.windowMs);
                    }
                }
            }
            else {
                // Redis未连接，使用内存存储
                const item = await memoryStore.get(key);
                if (item) {
                    current = await memoryStore.increment(key);
                    resetTime = item.resetTime;
                }
                else {
                    current = 1;
                    await memoryStore.set(key, current, mergedConfig.windowMs);
                }
            }
            // 检查是否超过限制
            if (current > mergedConfig.max) {
                if (mergedConfig.headers) {
                    res.setHeader('X-RateLimit-Limit', mergedConfig.max);
                    res.setHeader('X-RateLimit-Remaining', 0);
                    res.setHeader('X-RateLimit-Reset', Math.ceil(resetTime / 1000));
                }
                return res.status(429).json({
                    message: mergedConfig.message,
                    status: 'error',
                });
            }
            // 设置响应头
            if (mergedConfig.headers) {
                res.setHeader('X-RateLimit-Limit', mergedConfig.max);
                res.setHeader('X-RateLimit-Remaining', mergedConfig.max - current);
                res.setHeader('X-RateLimit-Reset', Math.ceil(resetTime / 1000));
            }
            next();
        }
        catch (error) {
            console.error('Rate limit error:', error);
            // 错误时不阻止请求，继续执行
            next();
        }
    };
};
exports.rateLimit = rateLimit;
// 敏感接口频率限制中间件
const sensitiveRateLimit = () => {
    return (0, exports.rateLimit)(sensitiveConfig);
};
exports.sensitiveRateLimit = sensitiveRateLimit;
// 登录接口频率限制中间件
const loginRateLimit = () => {
    return (0, exports.rateLimit)({
        windowMs: 60 * 1000, // 1分钟
        max: 5, // 每分钟5次请求
        message: 'Too many login attempts, please try again later.',
    });
};
exports.loginRateLimit = loginRateLimit;
// 注册接口频率限制中间件
const registerRateLimit = () => {
    return (0, exports.rateLimit)({
        windowMs: 60 * 1000, // 1分钟
        max: 3, // 每分钟3次请求
        message: 'Too many registration attempts, please try again later.',
    });
};
exports.registerRateLimit = registerRateLimit;
//# sourceMappingURL=rateLimiter.middleware.js.map