/**
 * 错误处理层
 * 统一定义和处理应用中的所有错误类型
 */
/**
 * 错误代码枚举
 */
export var ErrorCode;
(function (ErrorCode) {
    // 网络错误
    ErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
    ErrorCode["TIMEOUT"] = "TIMEOUT";
    ErrorCode["NO_INTERNET"] = "NO_INTERNET";
    // 认证和授权
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    // 客户端错误
    ErrorCode["BAD_REQUEST"] = "BAD_REQUEST";
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    // 服务器错误
    ErrorCode["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    ErrorCode["SERVICE_UNAVAILABLE"] = "SERVICE_UNAVAILABLE";
    // 业务逻辑错误
    ErrorCode["BUSINESS_ERROR"] = "BUSINESS_ERROR";
    // 其他
    ErrorCode["UNKNOWN"] = "UNKNOWN";
})(ErrorCode || (ErrorCode = {}));
/**
 * 错误映射表（HTTP 状态码 → 错误代码）
 */
const HTTP_CODE_MAP = {
    400: ErrorCode.BAD_REQUEST,
    401: ErrorCode.UNAUTHORIZED,
    403: ErrorCode.FORBIDDEN,
    404: ErrorCode.NOT_FOUND,
    408: ErrorCode.TIMEOUT,
    500: ErrorCode.INTERNAL_SERVER_ERROR,
    503: ErrorCode.SERVICE_UNAVAILABLE,
};
/**
 * 业务错误类
 */
export class BusinessError extends Error {
    constructor(code, message, statusCode, details) {
        super(message);
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'BusinessError';
    }
    toJSON() {
        return {
            code: this.code,
            message: this.message,
            statusCode: this.statusCode,
            details: this.details,
        };
    }
}
/**
 * 默认错误处理器
 */
export class DefaultErrorHandler {
    canHandle() {
        return true;
    }
    handle(error) {
        if (error instanceof BusinessError) {
            console.error(`[${error.code}] ${error.message}`, error.details);
        }
        else if (error instanceof Error) {
            console.error(`[${ErrorCode.UNKNOWN}] ${error.message}`);
        }
        else {
            console.error('[UNKNOWN] Unexpected error:', error);
        }
    }
}
/**
 * 错误处理器链
 */
export class ErrorHandlerChain {
    constructor() {
        this.handlers = [];
    }
    /**
     * 添加错误处理器
     */
    addHandler(handler) {
        this.handlers.push(handler);
    }
    /**
     * 处理错误
     */
    handle(error) {
        for (const handler of this.handlers) {
            if (handler.canHandle(error)) {
                handler.handle(error);
                return;
            }
        }
        // 如果没有特定处理器，使用默认处理器
        new DefaultErrorHandler().handle(error);
    }
}
/**
 * 错误工厂
 */
export class ErrorFactory {
    /**
     * 从 HTTP 状态码创建业务错误
     */
    static fromHttpStatus(statusCode, message, details) {
        const code = HTTP_CODE_MAP[statusCode] || ErrorCode.UNKNOWN;
        return new BusinessError(code, message || this.getDefaultMessage(code), statusCode, details);
    }
    /**
     * 从响应创建业务错误
     */
    static fromResponse(response) {
        const statusCode = response?.status || response?.statusCode || 500;
        const message = response?.data?.message || response?.message;
        const code = response?.data?.code || HTTP_CODE_MAP[statusCode] || ErrorCode.UNKNOWN;
        return new BusinessError(code, message || this.getDefaultMessage(code), statusCode, response?.data?.details);
    }
    /**
     * 创建验证错误
     */
    static validationError(message, details) {
        return new BusinessError(ErrorCode.VALIDATION_ERROR, message || '数据验证失败', 400, details);
    }
    /**
     * 创建业务错误
     */
    static businessError(message, details) {
        return new BusinessError(ErrorCode.BUSINESS_ERROR, message, 400, details);
    }
    /**
     * 获取错误的默认消息
     */
    static getDefaultMessage(code) {
        const messages = {
            [ErrorCode.NETWORK_ERROR]: '网络错误，请检查网络连接',
            [ErrorCode.TIMEOUT]: '请求超时，请重试',
            [ErrorCode.NO_INTERNET]: '无网络连接',
            [ErrorCode.UNAUTHORIZED]: '未授权，请登录',
            [ErrorCode.FORBIDDEN]: '禁止访问',
            [ErrorCode.TOKEN_EXPIRED]: '登录已过期，请重新登录',
            [ErrorCode.BAD_REQUEST]: '请求错误',
            [ErrorCode.NOT_FOUND]: '资源不存在',
            [ErrorCode.VALIDATION_ERROR]: '数据验证失败',
            [ErrorCode.INTERNAL_SERVER_ERROR]: '服务器错误',
            [ErrorCode.SERVICE_UNAVAILABLE]: '服务暂不可用',
            [ErrorCode.BUSINESS_ERROR]: '业务错误',
            [ErrorCode.UNKNOWN]: '未知错误',
        };
        return messages[code] || '未知错误';
    }
}
/**
 * 全局错误处理器
 */
let globalErrorChain = null;
/**
 * 获取全局错误处理器链
 */
export function getErrorHandlerChain() {
    if (!globalErrorChain) {
        globalErrorChain = new ErrorHandlerChain();
        globalErrorChain.addHandler(new DefaultErrorHandler());
    }
    return globalErrorChain;
}
/**
 * 处理全局错误
 */
export function handleError(error) {
    getErrorHandlerChain().handle(error);
}
export default {
    ErrorCode,
    BusinessError,
    ErrorFactory,
    ErrorHandlerChain,
    getErrorHandlerChain,
    handleError,
};
//# sourceMappingURL=index.js.map