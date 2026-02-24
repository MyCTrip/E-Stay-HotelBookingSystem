/**
 * 错误处理层
 * 统一定义和处理应用中的所有错误类型
 */
/**
 * 错误代码枚举
 */
export declare enum ErrorCode {
    NETWORK_ERROR = "NETWORK_ERROR",
    TIMEOUT = "TIMEOUT",
    NO_INTERNET = "NO_INTERNET",
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    BAD_REQUEST = "BAD_REQUEST",
    NOT_FOUND = "NOT_FOUND",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
    BUSINESS_ERROR = "BUSINESS_ERROR",
    UNKNOWN = "UNKNOWN"
}
/**
 * 业务错误类
 */
export declare class BusinessError extends Error {
    code: ErrorCode;
    message: string;
    statusCode?: number | undefined;
    details?: Record<string, any> | undefined;
    constructor(code: ErrorCode, message: string, statusCode?: number | undefined, details?: Record<string, any> | undefined);
    toJSON(): {
        code: ErrorCode;
        message: string;
        statusCode: number | undefined;
        details: Record<string, any> | undefined;
    };
}
/**
 * 错误处理器接口
 */
export interface IErrorHandler {
    handle: (error: Error | BusinessError | any) => void;
    canHandle: (error: any) => boolean;
}
/**
 * 默认错误处理器
 */
export declare class DefaultErrorHandler implements IErrorHandler {
    canHandle(): boolean;
    handle(error: Error | BusinessError | any): void;
}
/**
 * 错误处理器链
 */
export declare class ErrorHandlerChain {
    private handlers;
    /**
     * 添加错误处理器
     */
    addHandler(handler: IErrorHandler): void;
    /**
     * 处理错误
     */
    handle(error: Error | BusinessError | any): void;
}
/**
 * 错误工厂
 */
export declare class ErrorFactory {
    /**
     * 从 HTTP 状态码创建业务错误
     */
    static fromHttpStatus(statusCode: number, message?: string, details?: Record<string, any>): BusinessError;
    /**
     * 从响应创建业务错误
     */
    static fromResponse(response: any): BusinessError;
    /**
     * 创建验证错误
     */
    static validationError(message: string, details?: Record<string, any>): BusinessError;
    /**
     * 创建业务错误
     */
    static businessError(message: string, details?: Record<string, any>): BusinessError;
    /**
     * 获取错误的默认消息
     */
    private static getDefaultMessage;
}
/**
 * 获取全局错误处理器链
 */
export declare function getErrorHandlerChain(): ErrorHandlerChain;
/**
 * 处理全局错误
 */
export declare function handleError(error: Error | BusinessError | any): void;
declare const _default: {
    ErrorCode: typeof ErrorCode;
    BusinessError: typeof BusinessError;
    ErrorFactory: typeof ErrorFactory;
    ErrorHandlerChain: typeof ErrorHandlerChain;
    getErrorHandlerChain: typeof getErrorHandlerChain;
    handleError: typeof handleError;
};
export default _default;
//# sourceMappingURL=index.d.ts.map