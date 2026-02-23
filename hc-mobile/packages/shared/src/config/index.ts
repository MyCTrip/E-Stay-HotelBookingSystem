/**
 * 配置管理层
 * 统一管理应用级别的配置，支持环境分离、动态配置等
 */

/**
 * 应用环境
 */
export type Environment = 'development' | 'production' | 'staging'

/**
 * API 配置
 */
export interface ApiConfig {
  baseURL: string
  timeout?: number
  retryAttempts?: number
  retryDelay?: number
}

/**
 * 认证配置
 */
export interface AuthConfig {
  tokenKey: string
  tokenExpirationTime: number // 毫秒
  refreshTokenKey: string
}

/**
 * 存储配置
 */
export interface StorageConfig {
  prefix: string // 存储 key 前缀
  encryptionEnabled: boolean
}

/**
 * 日志配置
 */
export interface LoggingConfig {
  enabled: boolean
  level: 'debug' | 'info' | 'warn' | 'error'
  sentryDsn?: string // Sentry 错误追踪
}

/**
 * 应用配置
 */
export interface AppConfig {
  environment: Environment
  version: string
  api: ApiConfig
  auth: AuthConfig
  storage: StorageConfig
  logging: LoggingConfig
}

/**
 * 默认配置
 */
const DEFAULT_CONFIG: AppConfig = {
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
}

/**
 * 环境特定配置
 */
const ENVIRONMENT_CONFIGS: Record<Environment, Partial<AppConfig>> = {
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
}

/**
 * 配置管理器
 */
export class ConfigManager {
  private config: AppConfig

  constructor(initialConfig?: Partial<AppConfig>) {
    // 1. 使用默认配置
    this.config = { ...DEFAULT_CONFIG }

    // 2. 应用环境特定配置
    const environment = this.detectEnvironment()
    const envConfig = ENVIRONMENT_CONFIGS[environment]
    if (envConfig) {
      this.config = this.deepMerge(this.config, envConfig)
    }

    // 3. 应用初始化配置
    if (initialConfig) {
      this.config = this.deepMerge(this.config, initialConfig)
    }
  }

  /**
   * 检测运行环境
   */
  private detectEnvironment(): Environment {
    // 在浏览器中 process 不存在
    let envStr = 'development'
    if (typeof process !== 'undefined' && process.env) {
      envStr = process.env.NODE_ENV || 'development'
    } else if ((globalThis as any).__ENV__) {
      envStr = (globalThis as any).__ENV__
    }

    if (envStr === 'production') return 'production'
    if (envStr === 'staging') return 'staging'
    return 'development'
  }

  /**
   * 深度合并配置对象
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target }
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          typeof source[key] === 'object' &&
          source[key] !== null &&
          !Array.isArray(source[key])
        ) {
          result[key] = this.deepMerge(target[key] || {}, source[key])
        } else {
          result[key] = source[key]
        }
      }
    }
    return result
  }

  /**
   * 获取完整配置
   */
  getConfig(): AppConfig {
    return { ...this.config }
  }

  /**
   * 获取特定配置值
   */
  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key]
  }

  /**
   * 更新配置
   */
  update(updates: Partial<AppConfig>): void {
    this.config = this.deepMerge(this.config, updates)
  }

  /**
   * 重置为默认配置
   */
  reset(): void {
    this.config = { ...DEFAULT_CONFIG }
  }

  /**
   * 获取环境
   */
  getEnvironment(): Environment {
    return this.config.environment
  }

  /**
   * 是否开发环境
   */
  isDevelopment(): boolean {
    return this.config.environment === 'development'
  }

  /**
   * 是否生产环境
   */
  isProduction(): boolean {
    return this.config.environment === 'production'
  }
}

/**
 * 全局配置管理器实例
 */
let globalConfigManager: ConfigManager | null = null

/**
 * 初始化全局配置
 */
export function initializeConfig(config?: Partial<AppConfig>): ConfigManager {
  if (!globalConfigManager) {
    globalConfigManager = new ConfigManager(config)
  }
  return globalConfigManager
}

/**
 * 获取全局配置管理器
 */
export function getConfig(): ConfigManager {
  if (!globalConfigManager) {
    globalConfigManager = new ConfigManager()
  }
  return globalConfigManager
}

/**
 * 快速获取配置值
 */
export function getConfigValue<K extends keyof AppConfig>(key: K): AppConfig[K] {
  return getConfig().get(key)
}

export default {
  ConfigManager,
  initializeConfig,
  getConfig,
  getConfigValue,
  DEFAULT_CONFIG,
}
