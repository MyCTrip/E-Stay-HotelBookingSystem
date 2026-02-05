"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeRedisConnection = exports.redisClient = void 0;
const redis_1 = require("redis");
const logger_1 = __importDefault(require("../utils/logger"));
// 创建Redis客户端
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URI || 'redis://localhost:6379'
});
exports.redisClient = redisClient;
// 连接Redis
redisClient.connect().catch((error) => {
    logger_1.default.error('Redis连接失败:', error);
    // Redis连接失败不应该导致整个应用崩溃
    // 频率限制功能会在Redis不可用时降级
});
// 监听Redis连接事件
redisClient.on('connect', () => {
    logger_1.default.info('Redis连接成功');
});
redisClient.on('error', (error) => {
    logger_1.default.error('Redis错误:', error);
});
// 关闭Redis连接
const closeRedisConnection = async () => {
    try {
        await redisClient.disconnect();
        logger_1.default.info('Redis连接已关闭');
    }
    catch (error) {
        logger_1.default.error('关闭Redis连接失败:', error);
    }
};
exports.closeRedisConnection = closeRedisConnection;
//# sourceMappingURL=redis.js.map