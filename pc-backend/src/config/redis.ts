import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Redis连接配置
const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD || undefined,
  database: parseInt(process.env.REDIS_DB || '0'),
};

// 创建Redis客户端
let redisClient: RedisClientType;

// 初始化Redis连接
export const initializeRedis = async (): Promise<void> => {
  try {
    redisClient = createClient(redisConfig);

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
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    // Redis连接失败不应该阻止应用启动，使用内存存储作为后备
  }
};

// 获取Redis客户端
export const getRedisClient = (): RedisClientType | null => {
  return redisClient;
};

// 关闭Redis连接
export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
  }
};

// 检查Redis是否连接
export const isRedisConnected = (): boolean => {
  if (!redisClient) {
    return false;
  }
  
  // 检查客户端状态
  try {
    return redisClient.isReady;
  } catch (error) {
    return false;
  }
};
