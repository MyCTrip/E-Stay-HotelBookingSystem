import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Redis连接配置
const baseRedisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD || undefined,
  database: parseInt(process.env.REDIS_DB || '0'),
};

// 创建Redis客户端引用
let redisClient: RedisClientType | undefined;

// 只记录一次的错误标识，避免日志风暴
let hasLoggedRedisError = false;

// 限制重连策略，避免无限重连
const socketConfig = {
  // 限制最多重连 3 次，超过则停止重连
  reconnectStrategy: (retries: number) => {
    if (retries > 3) return false;
    return Math.min(1000 * retries, 30000);
  },
};

// 初始化Redis连接（非阻塞）
export const initializeRedis = async (): Promise<void> => {
  try {
    // 创建客户端但不要阻塞主流程等待长时间的重连
    redisClient = createClient({ ...(baseRedisConfig as any), socket: socketConfig });

    // 连接事件
    redisClient.on('connect', () => {
      console.log('Redis connected successfully');
    });

    // 错误事件：只在首次记录为 warn，后续降为调试级别
    redisClient.on('error', (err) => {
      if (!hasLoggedRedisError) {
        console.warn('Redis connection error (first occurrence):', err);
        hasLoggedRedisError = true;
      } else {
        // 使用 console.debug 保持更少噪音；有需要可替换为项目 logger
        if ((console as any).debug) (console as any).debug('Redis connection error:', err);
      }
    });

    // 断开连接事件
    redisClient.on('end', () => {
      console.log('Redis connection ended');
    });

    // 发起连接，但不要 await 阻塞启动流程——使用非阻塞的 catch 来记录错误
    redisClient.connect().catch((err) => {
      if (!hasLoggedRedisError) {
        console.warn('Redis connect failed (non-blocking):', err);
        hasLoggedRedisError = true;
      } else {
        if ((console as any).debug) (console as any).debug('Redis connect failed:', err);
      }
    });
  } catch (error) {
    // 任何异常都不应阻止应用启动
    if (!hasLoggedRedisError) {
      console.warn('Failed to initialize Redis (caught):', error);
      hasLoggedRedisError = true;
    }
  }
};

// 获取Redis客户端，只有在就绪时才返回实例
export const getRedisClient = (): RedisClientType | null => {
  if (!redisClient) return null;
  try {
    return redisClient.isReady ? redisClient : null;
  } catch (error) {
    return null;
  }
};

// 关闭Redis连接
export const closeRedis = async (): Promise<void> => {
  if (redisClient && redisClient.isOpen) {
    try {
      await redisClient.quit();
    } catch (error) {
      // 忽略关闭错误
    }
  }
};

// 检查Redis是否连接
export const isRedisConnected = (): boolean => {
  if (!redisClient) return false;
  try {
    return !!redisClient.isReady;
  } catch (error) {
    return false;
  }
};
