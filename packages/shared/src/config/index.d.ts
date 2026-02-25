/**
 * 配置管理层
 * 统一管理应用级别的配置，支持环境分离、动态配置等
 */
/**
 * 应用环境
 */
export type Environment = 'development' | 'production' | 'staging';
/**
 * API 配置
 */
export interface ApiConfig {
    baseURL: string;
    timeout?: number;
    retryAttempts?: number;
    retryDelay?: number;
}
/**
 * 认证配置
 */
export interface AuthConfig {
    tokenKey: string;
    tokenExpirationTime: number;
    refreshTokenKey: string;
}
/**
 * 存储配置
 */
export interface StorageConfig {
    prefix: string;
    encryptionEnabled: boolean;
}
/**
 * 日志配置
 */
export interface LoggingConfig {
    enabled: boolean;
    level: 'debug' | 'info' | 'warn' | 'error';
    sentryDsn?: string;
}
/**
 * 应用配置
 */
export interface AppConfig {
    environment: Environment;
    version: string;
    api: ApiConfig;
    auth: AuthConfig;
    storage: StorageConfig;
    logging: LoggingConfig;
}
/**
 * 配置管理器
 */
export declare class ConfigManager {
    private config;
    constructor(initialConfig?: Partial<AppConfig>);
    /**
     * 检测运行环境
     */
    private detectEnvironment;
    /**
     * 深度合并配置对象
     */
    private deepMerge;
    /**
     * 获取完整配置
     */
    getConfig(): AppConfig;
    /**
     * 获取特定配置值
     */
    get<K extends keyof AppConfig>(key: K): AppConfig[K];
    /**
     * 更新配置
     */
    update(updates: Partial<AppConfig>): void;
    /**
     * 重置为默认配置
     */
    reset(): void;
    /**
     * 获取环境
     */
    getEnvironment(): Environment;
    /**
     * 是否开发环境
     */
    isDevelopment(): boolean;
    /**
     * 是否生产环境
     */
    isProduction(): boolean;
}
/**
 * 初始化全局配置
 */
export declare function initializeConfig(config?: Partial<AppConfig>): ConfigManager;
/**
 * 获取全局配置管理器
 */
export declare function getConfig(): ConfigManager;
/**
 * 快速获取配置值
 */
export declare function getConfigValue<K extends keyof AppConfig>(key: K): AppConfig[K];
declare const _default: {
    ConfigManager: typeof ConfigManager;
    initializeConfig: typeof initializeConfig;
    getConfig: typeof getConfig;
    getConfigValue: typeof getConfigValue;
    DEFAULT_CONFIG: AppConfig;
};
export default _default;
//# sourceMappingURL=index.d.ts.map