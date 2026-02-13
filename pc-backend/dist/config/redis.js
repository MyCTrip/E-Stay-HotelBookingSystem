"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRedisConnected = exports.closeRedis = exports.getRedisClient = exports.initializeRedis = void 0;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Redis连接配置
const redisConfig = {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || undefined,
    database: parseInt(process.env.REDIS_DB || '0'),
};
// 创建Redis客户端
let redisClient;
// 初始化Redis连接
const initializeRedis = async () => {
    try {
        redisClient = (0, redis_1.createClient)(redisConfig);
        // 连接事件
        redisClient.on('connect', () => {
            console.log('Redis connected successfully');
        });
        // 错误事件
        redisClient.on('error', (err) => {
            console.error('Redis connection error:', err);
        });
        // 断开连接事件
        redisClient.on('end', () => {
            console.log('Redis connection ended');
        });
        // 连接到Redis
        await redisClient.connect();
    }
    catch (error) {
        console.error('Failed to initialize Redis:', error);
        // Redis连接失败不应该阻止应用启动，使用内存存储作为后备
    }
};
exports.initializeRedis = initializeRedis;
// 获取Redis客户端
const getRedisClient = () => {
    return redisClient;
};
exports.getRedisClient = getRedisClient;
// 关闭Redis连接
const closeRedis = async () => {
    if (redisClient) {
        await redisClient.quit();
    }
};
exports.closeRedis = closeRedis;
// 检查Redis是否连接
const isRedisConnected = () => {
    if (!redisClient) {
        return false;
    }
    // 检查客户端状态
    try {
        return redisClient.isReady;
    }
    catch (error) {
        return false;
    }
};
exports.isRedisConnected = isRedisConnected;
//# sourceMappingURL=redis.js.map