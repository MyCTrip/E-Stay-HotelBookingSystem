/**
 * 中间件管理层
 * 统一处理 API 请求的拦截、转换、日志等横切关注点
 */
/**
 * 中间件管理器
 */
export class MiddlewareManager {
    constructor() {
        this.middlewares = [];
    }
    /**
     * 注册中间件
     */
    register(middleware) {
        if (this.middlewares.some((m) => m.name === middleware.name)) {
            console.warn(`Middleware "${middleware.name}" already registered, skipping...`);
            return;
        }
        this.middlewares.push(middleware);
    }
    /**
     * 执行请求中间件链
     */
    async executeRequestMiddleware(config) {
        let result = config;
        for (const middleware of this.middlewares) {
            if (middleware.onRequest) {
                result = await middleware.onRequest(result);
            }
        }
        return result;
    }
    /**
     * 执行响应中间件链
     */
    async executeResponseMiddleware(data) {
        let result = data;
        for (const middleware of this.middlewares) {
            if (middleware.onResponse) {
                result = await middleware.onResponse(result);
            }
        }
        return result;
    }
    /**
     * 执行错误中间件链
     */
    async executeErrorMiddleware(error) {
        for (const middleware of this.middlewares) {
            if (middleware.onError) {
                try {
                    await middleware.onError(error);
                }
                catch (e) {
                    // 继续执行其他中间件
                }
            }
        }
        throw error;
    }
    /**
     * 获取所有已注册的中间件
     */
    getMiddlewares() {
        return [...this.middlewares];
    }
    /**
     * 清空所有中间件
     */
    clear() {
        this.middlewares = [];
    }
}
/**
 * 创建日志中间件
 */
export function createLoggingMiddleware() {
    return {
        name: 'logging',
        onRequest: (config) => {
            console.log('[API Request]', {
                method: config.method?.toUpperCase(),
                url: config.url,
                params: config.params,
            });
            return config;
        },
        onResponse: (data) => {
            console.log('[API Response]', data);
            return data;
        },
        onError: (error) => {
            console.error('[API Error]', error.message);
            throw error;
        },
    };
}
/**
 * 创建性能监控中间件
 */
export function createPerformanceMiddleware() {
    const timings = new Map();
    return {
        name: 'performance',
        onRequest: (config) => {
            const key = `${config.method}:${config.url}`;
            timings.set(key, Date.now());
            return config;
        },
        onResponse: (data) => {
            const entries = timings.entries();
            for (const [key, startTime] of entries) {
                const duration = Date.now() - startTime;
                if (duration > 1000) {
                    console.warn(`[Performance] ${key} took ${duration}ms`);
                }
                timings.delete(key);
            }
            return data;
        },
    };
}
/**
 * 全局中间件管理器实例
 */
let globalMiddlewareManager = null;
/**
 * 获取全局中间件管理器
 */
export function getMiddlewareManager() {
    if (!globalMiddlewareManager) {
        globalMiddlewareManager = new MiddlewareManager();
    }
    return globalMiddlewareManager;
}
/**
 * 初始化默认中间件
 */
export function initializeDefaultMiddlewares() {
    const manager = getMiddlewareManager();
    if (manager.getMiddlewares().length === 0) {
        manager.register(createLoggingMiddleware());
        manager.register(createPerformanceMiddleware());
    }
}
export default {
    MiddlewareManager,
    getMiddlewareManager,
    initializeDefaultMiddlewares,
    createLoggingMiddleware,
    createPerformanceMiddleware,
};
//# sourceMappingURL=index.js.map