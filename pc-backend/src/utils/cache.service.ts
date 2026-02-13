import { getRedisClient } from '../config/redis';

interface CacheOptions {
  expiration?: number; // 过期时间（秒）
  keyPrefix?: string; // 键前缀
}

export class CacheService {
  private defaultExpiration = 300; // 默认过期时间：5分钟
  private defaultPrefix = 'cache:';

  /**
   * 生成缓存键
   */
  private generateKey(key: string, prefix?: string): string {
    return `${prefix || this.defaultPrefix}${key}`;
  }

  /**
   * 设置缓存
   */
  async set(key: string, value: any, options: CacheOptions = {}): Promise<void> {
    const redisClient = getRedisClient();
    if (!redisClient) return;

    const cacheKey = this.generateKey(key, options.keyPrefix);
    const expiration = options.expiration || this.defaultExpiration;

    try {
      await redisClient.set(cacheKey, JSON.stringify(value), {
        EX: expiration,
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * 获取缓存
   */
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const redisClient = getRedisClient();
    if (!redisClient) return null;

    const cacheKey = this.generateKey(key, options.keyPrefix);

    try {
      const value = await redisClient.get(cacheKey);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * 删除缓存
   */
  async delete(key: string, options: CacheOptions = {}): Promise<void> {
    const redisClient = getRedisClient();
    if (!redisClient) return;

    const cacheKey = this.generateKey(key, options.keyPrefix);

    try {
      await redisClient.del(cacheKey);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * 清除匹配模式的缓存
   */
  async clearPattern(pattern: string, options: CacheOptions = {}): Promise<void> {
    const redisClient = getRedisClient();
    if (!redisClient) return;

    const prefix = options.keyPrefix || this.defaultPrefix;
    const matchPattern = `${prefix}${pattern}`;

    try {
      const keys = await redisClient.keys(matchPattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.error('Cache clear pattern error:', error);
    }
  }

  /**
   * 缓存装饰器：用于缓存函数返回值
   */
  cache<T extends (...args: any[]) => Promise<any>>(options: CacheOptions = {}) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value;

      descriptor.value = async function(...args: any[]) {
        const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;
        const cacheService = new CacheService();

        // 尝试从缓存获取
        const cachedValue = await cacheService.get<T>(cacheKey, options);
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

export const cacheService = new CacheService();
