"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = cache;
exports.clearCache = clearCache;
const cache_service_1 = require("../utils/cache.service");
/**
 * 生成缓存键
 */
function generateCacheKey(req, excludeQueryParams = []) {
    const { method, path, query } = req;
    // 过滤查询参数
    const filteredQuery = Object.fromEntries(Object.entries(query).filter(([key]) => !excludeQueryParams.includes(key)));
    return `${method}:${path}:${JSON.stringify(filteredQuery)}`;
}
/**
 * 缓存中间件
 */
function cache(options = {}) {
    return async (req, res, next) => {
        // 只缓存GET请求
        if (req.method !== 'GET') {
            return next();
        }
        // 生成缓存键
        const cacheKey = generateCacheKey(req, options.excludeQueryParams);
        try {
            // 尝试从缓存获取
            const cachedData = await cache_service_1.cacheService.get(cacheKey, {
                keyPrefix: options.keyPrefix,
            });
            if (cachedData !== null) {
                // 设置缓存命中头
                res.setHeader('X-Cache-Hit', 'true');
                return res.json(cachedData);
            }
            // 缓存未命中，重写res.json方法
            const originalJson = res.json.bind(res);
            res.json = function (data) {
                // 异步存入缓存，不阻塞响应
                cache_service_1.cacheService.set(cacheKey, data, {
                    keyPrefix: options.keyPrefix,
                    expiration: options.expiration,
                }).catch(error => {
                    console.error('Cache set error in middleware:', error);
                });
                // 设置缓存未命中头
                res.setHeader('X-Cache-Hit', 'false');
                return originalJson(data);
            };
            next();
        }
        catch (error) {
            console.error('Cache middleware error:', error);
            // 缓存错误不应阻止请求继续
            next();
        }
    };
}
/**
 * 清除缓存的中间件
 */
function clearCache(pattern, options = {}) {
    return async (req, res, next) => {
        try {
            await cache_service_1.cacheService.clearPattern(pattern, {
                keyPrefix: options.keyPrefix,
            });
            console.log(`Cache cleared for pattern: ${pattern}`);
        }
        catch (error) {
            console.error('Clear cache error:', error);
        }
        next();
    };
}
//# sourceMappingURL=cache.middleware.js.map