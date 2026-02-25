/**
 * 配置管理层
 * 统一管理应用级别的配置，支持环境分离、动态配置等
 */
/**
 * 默认配置
 */
const DEFAULT_CONFIG = {
    environment: 'development',
    version: '1.0.0',
    api: {
        baseURL: 'http://localhost:3000/api',
        timeout: 10000,
        retryAttempts: 3,
        retryDelay: 1000,
    },
    auth: {
        tokenKey: 'auth_token',
        tokenExpirationTime: 24 * 60 * 60 * 1000, // 24 小时
        refreshTokenKey: 'refresh_token',
    },
    storage: {
        prefix: 'estay_',
        encryptionEnabled: false,
    },
    logging: {
        enabled: true,
        level: 'info',
    },
};
/**
 * 环境特定配置
 */
const ENVIRONMENT_CONFIGS = {
    development: {
        api: {
            baseURL: 'http://localhost:3000/api',
        },
        logging: {
            enabled: true,
            level: 'debug',
        },
    },
    staging: {
        api: {
            baseURL: 'https://staging-api.estay.com/api',
        },
        logging: {
            enabled: true,
            level: 'info',
        },
    },
    production: {
        api: {
            baseURL: 'https://api.estay.com/api',
        },
        logging: {
            enabled: true,
            level: 'warn',
        },
    },
};
/**
 * 配置管理器
 */
export class ConfigManager {
    constructor(initialConfig) {
        // 1. 使用默认配置
        this.config = { ...DEFAULT_CONFIG };
        // 2. 应用环境特定配置
        const environment = this.detectEnvironment();
        const envConfig = ENVIRONMENT_CONFIGS[environment];
        if (envConfig) {
            this.config = this.deepMerge(this.config, envConfig);
        }
        // 3. 应用初始化配置
        if (initialConfig) {
            this.config = this.deepMerge(this.config, initialConfig);
        }
    }
    /**
     * 检测运行环境
     */
    detectEnvironment() {
        // 在浏览器中 process 不存在
        let envStr = 'development';
        if (typeof process !== 'undefined' && process.env) {
            envStr = process.env.NODE_ENV || 'development';
        }
        else if (globalThis.__ENV__) {
            envStr = globalThis.__ENV__;
        }
        if (envStr === 'production')
            return 'production';
        if (envStr === 'staging')
            return 'staging';
        return 'development';
    }
    /**
     * 深度合并配置对象
     */
    deepMerge(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === 'object' &&
                    source[key] !== null &&
                    !Array.isArray(source[key])) {
                    result[key] = this.deepMerge(target[key] || {}, source[key]);
                }
                else {
                    result[key] = source[key];
                }
            }
        }
        return result;
    }
    /**
     * 获取完整配置
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * 获取特定配置值
     */
    get(key) {
        return this.config[key];
    }
    /**
     * 更新配置
     */
    update(updates) {
        this.config = this.deepMerge(this.config, updates);
    }
    /**
     * 重置为默认配置
     */
    reset() {
        this.config = { ...DEFAULT_CONFIG };
    }
    /**
     * 获取环境
     */
    getEnvironment() {
        return this.config.environment;
    }
    /**
     * 是否开发环境
     */
    isDevelopment() {
        return this.config.environment === 'development';
    }
    /**
     * 是否生产环境
     */
    isProduction() {
        return this.config.environment === 'production';
    }
}
/**
 * 全局配置管理器实例
 */
let globalConfigManager = null;
/**
 * 初始化全局配置
 */
export function initializeConfig(config) {
    if (!globalConfigManager) {
        globalConfigManager = new ConfigManager(config);
    }
    return globalConfigManager;
}
/**
 * 获取全局配置管理器
 */
export function getConfig() {
    if (!globalConfigManager) {
        globalConfigManager = new ConfigManager();
    }
    return globalConfigManager;
}
/**
 * 快速获取配置值
 */
export function getConfigValue(key) {
    return getConfig().get(key);
}
export default {
    ConfigManager,
    initializeConfig,
    getConfig,
    getConfigValue,
    DEFAULT_CONFIG,
};
//# sourceMappingURL=index.js.map