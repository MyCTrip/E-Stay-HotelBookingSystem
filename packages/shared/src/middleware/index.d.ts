/**
 * 中间件管理层
 * 统一处理 API 请求的拦截、转换、日志等横切关注点
 */
export interface IMiddleware {
    name: string;
    onRequest?: (config: any) => Promise<any> | any;
    onResponse?: (data: any) => Promise<any> | any;
    onError?: (error: Error) => Promise<never> | never;
}
/**
 * 中间件管理器
 */
export declare class MiddlewareManager {
    private middlewares;
    /**
     * 注册中间件
     */
    register(middleware: IMiddleware): void;
    /**
     * 执行请求中间件链
     */
    executeRequestMiddleware(config: any): Promise<any>;
    /**
     * 执行响应中间件链
     */
    executeResponseMiddleware(data: any): Promise<any>;
    /**
     * 执行错误中间件链
     */
    executeErrorMiddleware(error: Error): Promise<never>;
    /**
     * 获取所有已注册的中间件
     */
    getMiddlewares(): IMiddleware[];
    /**
     * 清空所有中间件
     */
    clear(): void;
}
/**
 * 创建日志中间件
 */
export declare function createLoggingMiddleware(): IMiddleware;
/**
 * 创建性能监控中间件
 */
export declare function createPerformanceMiddleware(): IMiddleware;
/**
 * 获取全局中间件管理器
 */
export declare function getMiddlewareManager(): MiddlewareManager;
/**
 * 初始化默认中间件
 */
export declare function initializeDefaultMiddlewares(): void;
declare const _default: {
    MiddlewareManager: typeof MiddlewareManager;
    getMiddlewareManager: typeof getMiddlewareManager;
    initializeDefaultMiddlewares: typeof initializeDefaultMiddlewares;
    createLoggingMiddleware: typeof createLoggingMiddleware;
    createPerformanceMiddleware: typeof createPerformanceMiddleware;
};
export default _default;
//# sourceMappingURL=index.d.ts.map