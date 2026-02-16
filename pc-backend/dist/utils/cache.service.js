"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = exports.CacheService = void 0;
const redis_1 = require("../config/redis");
class CacheService {
    constructor() {
        this.defaultExpiration = 300; // 默认过期时间：5分钟
        this.defaultPrefix = 'cache:';
    }
    /**
     * 生成缓存键
     */
    generateKey(key, prefix) {
        return `${prefix || this.defaultPrefix}${key}`;
    }
    /**
     * 设置缓存
     */
    async set(key, value, options = {}) {
        const redisClient = (0, redis_1.getRedisClient)();
        if (!redisClient)
            return;
        const cacheKey = this.generateKey(key, options.keyPrefix);
        const expiration = options.expiration || this.defaultExpiration;
        try {
            await redisClient.set(cacheKey, JSON.stringify(value), {
                EX: expiration,
            });
        }
        catch (error) {
            console.error('Cache set error:', error);
        }
    }
    /**
     * 获取缓存
     */
    async get(key, options = {}) {
        const redisClient = (0, redis_1.getRedisClient)();
        if (!redisClient)
            return null;
        const cacheKey = this.generateKey(key, options.keyPrefix);
        try {
            const value = await redisClient.get(cacheKey);
            return value ? JSON.parse(value) : null;
        }
        catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }
    /**
     * 删除缓存
     */
    async delete(key, options = {}) {
        const redisClient = (0, redis_1.getRedisClient)();
        if (!redisClient)
            return;
        const cacheKey = this.generateKey(key, options.keyPrefix);
        try {
            await redisClient.del(cacheKey);
        }
        catch (error) {
            console.error('Cache delete error:', error);
        }
    }
    /**
     * 清除匹配模式的缓存
     */
    async clearPattern(pattern, options = {}) {
        const redisClient = (0, redis_1.getRedisClient)();
        if (!redisClient)
            return;
        const prefix = options.keyPrefix || this.defaultPrefix;
        const matchPattern = `${prefix}${pattern}`;
        try {
            const keys = await redisClient.keys(matchPattern);
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        }
        catch (error) {
            console.error('Cache clear pattern error:', error);
        }
    }
    /**
     * 缓存装饰器：用于缓存函数返回值
     */
    cache(options = {}) {
        return (target, propertyKey, descriptor) => {
            const originalMethod = descriptor.value;
            descriptor.value = async function (...args) {
                const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;
                const cacheService = new CacheService();
                // 尝试从缓存获取
                const cachedValue = await cacheService.get(cacheKey, options);
                if (cachedValue !== null) {
                    return cachedValue;
                }
                // 调用原始方法
                const result = await originalMethod.apply(this, args);
                // 存入缓存
                await cacheService.set(cacheKey, result, options);
                return result;
            };
            return descriptor;
        };
    }
}
exports.CacheService = CacheService;
exports.cacheService = new CacheService();
//# sourceMappingURL=cache.service.js.map