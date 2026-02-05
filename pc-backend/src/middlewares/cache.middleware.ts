import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../utils/cache.service';

interface CacheMiddlewareOptions {
  expiration?: number; // 过期时间（秒）
  keyPrefix?: string; // 键前缀
  excludeQueryParams?: string[]; // 排除的查询参数
}

/**
 * 生成缓存键
 */
function generateCacheKey(req: Request, excludeQueryParams: string[] = []): string {
  const { method, path, query } = req;
  
  // 过滤查询参数
  const filteredQuery = Object.fromEntries(
    Object.entries(query).filter(([key]) => !excludeQueryParams.includes(key))
  );
  
  return `${method}:${path}:${JSON.stringify(filteredQuery)}`;
}

/**
 * 缓存中间件
 */
export function cache(options: CacheMiddlewareOptions = {}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 只缓存GET请求
    if (req.method !== 'GET') {
      return next();
    }

    // 生成缓存键
    const cacheKey = generateCacheKey(req, options.excludeQueryParams);

    try {
      // 尝试从缓存获取
      const cachedData = await cacheService.get(cacheKey, {
        keyPrefix: options.keyPrefix,
      });

      if (cachedData !== null) {
        // 设置缓存命中头
        res.setHeader('X-Cache-Hit', 'true');
        return res.json(cachedData);
      }

      // 缓存未命中，重写res.json方法
      const originalJson = res.json.bind(res);
      
      res.json = function(data: any) {
        // 异步存入缓存，不阻塞响应
        cacheService.set(cacheKey, data, {
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
    } catch (error) {
      console.error('Cache middleware error:', error);
      // 缓存错误不应阻止请求继续
      next();
    }
  };
}

/**
 * 清除缓存的中间件
 */
export function clearCache(pattern: string, options: CacheMiddlewareOptions = {}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cacheService.clearPattern(pattern, {
        keyPrefix: options.keyPrefix,
      });
      console.log(`Cache cleared for pattern: ${pattern}`);
    } catch (error) {
      console.error('Clear cache error:', error);
    }
    next();
  };
}
