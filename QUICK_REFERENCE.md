# 框架改进快速参考

## 🔄 架构改进概览

### P0: 核心架构修复 (3 项)
1. ✅ **Store 惰性初始化** - 真正的单例模式，幂等初始化
2. ✅ **API 适配器一致性** - 请求拦截器使用 storage adapter
3. ✅ **响应格式标准化** - 统一 `{code, data, message}` 格式

### P1: 基础设施 (6 项)  
4. ✅ **中间件管理** - 请求/响应/错误三阶段中间件链
5. ✅ **错误处理** - 14 种标准错误类型 + 错误工厂 + 处理链
6. ✅ **配置管理** - 环境感知的配置（dev/staging/prod）
7. ✅ **数据持久化** - 搜索历史、收藏、用户偏好
8. ✅ **Web H5 页面** - 首页、搜索、酒店详情、房型详情、404
9. ✅ **小程序页面** - 5 个主要页面（包含 Tab 导航）

---

## 📂 关键文件和使用

### Store 管理
```typescript
// 导入
import { useHotelStore, initHotelStore, resetHotelStore } from '@estay/shared'

// 初始化（app 启动时）
initHotelStore(api)

// 使用 Store
const store = useHotelStore()
await store.fetchHotels({ city: 'Beijing' })
```

### 中间件
```typescript
// 导入
import { getMiddlewareManager, createLoggingMiddleware } from '@estay/shared'

// 初始化（已在 main.tsx 中调用）
initializeDefaultMiddlewares()

// 获取管理器
const manager = getMiddlewareManager()
manager.register(createLoggingMiddleware())

// 自定义中间件
manager.register({
  name: 'custom',
  onRequest: async (config) => {
    console.log('Request:', config)
    return config
  }
})
```

### 错误处理
```typescript
// 导入
import { ErrorCode, BusinessError, ErrorFactory, handleError } from '@estay/shared'

// 使用工厂创建错误
const err = ErrorFactory.fromHttpStatus(404, 'Not Found')
const err2 = ErrorFactory.validationError('Invalid email')
const err3 = ErrorFactory.businessError('Booking failed')

// 处理错误
try {
  // ...
} catch (error) {
  handleError(error)
}
```

### 配置管理
```typescript
// 导入
import { initializeConfig, getConfig, getConfigValue } from '@estay/shared'

// 初始化（已在 main.tsx 中调用）
initializeConfig({
  api: { baseURL: 'https://api.example.com' },
  storage: { prefix: 'my_app_' }
})

// 获取配置
const config = getConfig()
const apiBase = getConfigValue('api').baseURL

// 查询环境
console.log(config.isDevelopment())  // 是否开发环境
console.log(config.isProduction())  // 是否生产环境
```

### 数据持久化
```typescript
// 导入
import { getPersistenceManager } from '@estay/shared'

const persistence = getPersistenceManager()

// 搜索历史
await persistence.saveSearchHistory({
  id: '1',
  query: 'luxury hotels',
  city: 'Beijing',
  checkIn: '2024-01-15',
  checkOut: '2024-01-18',
  guests: 2,
  timestamp: Date.now()
})
const history = await persistence.getSearchHistories()

// 收藏
await persistence.addFavorite('hotel_123')
const isFaved = await persistence.isFavorited('hotel_123')
const favorites = await persistence.getFavorites()

// 用户偏好
await persistence.savePreferences({
  theme: 'dark',
  language: 'en-US'
})
const prefs = await persistence.getPreferences()
```

### API 服务
```typescript
// 导入
import { createApiService, createMockApiService } from '@estay/shared'

// 创建真实 API 实例
const api = createApiService({
  baseURL: 'https://api.example.com',
  storage: webStorageImpl,  // 用于获取 auth token
  timeout: 15000
})

// 或使用 Mock API（开发用）
const mockApi = createMockApiService()

// 使用 API
const result = await api.getHotels({ city: 'Beijing' })
const hotel = await api.getHotelDetail('hotel_123')
```

---

## 🗂️ 项目结构

```
packages/
├── shared/                    # 共享业务层
│   ├── src/
│   │   ├── api/              # ✨ API 服务（统一响应格式）
│   │   ├── adapters/         # 存储适配器（Web/Taro）
│   │   ├── stores/           # ✨ Store 管理（惰性初始化）
│   │   ├── middleware/       # ✨ 中间件系统
│   │   ├── errors/           # ✨ 错误处理
│   │   ├── config/           # ✨ 配置管理
│   │   ├── persistence/      # ✨ 数据持久化
│   │   ├── types/            # TypeScript 类型定义
│   │   ├── utils/            # 工具函数
│   │   └── index.ts          # 主导出文件
│   └── package.json
│
├── web-h5/                    # Web H5 应用
│   ├── src/
│   │   ├── router/           # ✨ 路由配置
│   │   ├── layouts/          # ✨ 主布局组件
│   │   ├── pages/            # ✨ 页面组件
│   │   │   ├── Home.tsx
│   │   │   ├── SearchResult.tsx
│   │   │   ├── HotelDetail.tsx
│   │   │   ├── RoomDetail.tsx
│   │   │   └── NotFound.tsx
│   │   ├── components/       # 通用组件
│   │   ├── App.tsx           # ✨ 应用根组件（集成路由）
│   │   ├── main.tsx          # ✨ 入口（完整初始化）
│   │   └── index.css
│   ├── .env                  # ✨ 环境配置
│   └── vite.config.ts
│
└── mini-program/              # WeChat 小程序
    ├── src/
    │   ├── pages/            # ✨ 页面组件
    │   │   ├── Home/
    │   │   ├── Search/
    │   │   ├── HotelDetail/
    │   │   ├── RoomDetail/
    │   │   └── Mine/
    │   ├── app.tsx           # ✨ 应用根组件（完整初始化）
    │   ├── app.config.ts     # ✨ 小程序配置 + TabBar
    │   └── app.scss
    └── package.json
```

✨ = 本次补强新增或重大改进

---

## 🔗 初始化流程

### Web H5 (`main.tsx`)
```typescript
1. initializeConfig()           // 配置管理
2. initializeDefaultMiddlewares() // 中间件
3. registerStorage()            // 存储适配
4. createApiService()           // API 服务
5. initHotelStore()            // Store 初始化
6. createQueryClient()          // React Query
7. ReactDOM.render()            // 启动应用
```

### 小程序 (`app.tsx`, `componentDidMount`)
```typescript
1. initializeConfig()
2. initializeDefaultMiddlewares()
3. createTaroStorageImpl()      // Taro 存储适配
4. registerStorage()
5. createApiService()
6. initHotelStore()
```

---

## 🚀 比较：修复前后

### Store 使用
```typescript
// ❌ 之前（不安全）
export let useHotelStore = null
export function initHotelStore(api) {
  useHotelStore = createHotelStore(api)  // ⚠️ 可被覆盖
}

// ✅ 之后（安全）
export function useHotelStore() {
  if (!storeInstance) throw Error('Not initialized')
  return storeInstance
}
export function initHotelStore(api) {
  if (storeInstance) return  // ✨ 幂等性
  storeInstance = createHotelStore(api)
}
```

### API 响应
```typescript
// ❌ 之前（不一致）
getHotels: () => ({ data: [...], meta: {...} })
getHotHotels: () => [...]  // ⚠️ 直接返回数组

// ✅ 之后（统一）
getHotels: () => ({
  code: 200,
  data: { items: [...], total: X, page: 1, limit: 10 },
  message: 'success'
})
getHotHotels: () => ({
  code: 200,
  data: [...],
  message: 'success'
})
```

### API 拦截器
```typescript
// ❌ 之前（硬编码）
instance.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('auth_token')  // ⚠️ Web only
  // ...
})

// ✅ 之后（适配器模式）
instance.interceptors.request.use(async (cfg) => {
  let token = null
  if (config.storage) {
    token = await config.storage.getItem('auth_token')  // ✨ Web/Taro
  } else if (typeof window !== 'undefined') {
    token = localStorage.getItem('auth_token')
  }
  // ...
})
```

---

## 📖 常见任务

### 添加新的 API 端点
```typescript
// 1. 更新 IApiService 接口
export interface IApiService {
  // ... 现有端点
  getReviews: (hotelId: string) => Promise<any>  // 新端点
}

// 2. 在 createApiService 中添加实现
return {
  // ... 现有方法
  getReviews: (hotelId) => instance.get(`/hotels/${hotelId}/reviews`)
}

// 3. 在 createMockApiService 中添加 Mock
getReviews: async (hotelId): Promise<any> => ({
  code: 200,
  data: [/* reviews */],
  message: 'success'
})
```

### 添加新的中间件
```typescript
const customMiddleware = {
  name: 'analytics',
  onRequest: (config) => {
    // 记录请求开始
    window.analytics?.logRequest(config)
    return config
  },
  onResponse: (data) => {
    // 记录成功响应
    window.analytics?.logSuccess(data)
    return data
  },
  onError: (error) => {
    // 记录错误
    window.analytics?.logError(error)
    throw error
  }
}

getMiddlewareManager().register(customMiddleware)
```

### 自定义错误处理
```typescript
class CustomErrorHandler implements IErrorHandler {
  canHandle(error: any): boolean {
    return error instanceof BusinessError && 
           error.code === ErrorCode.UNAUTHORIZED
  }
  
  handle(error: Error | BusinessError): void {
    // 清除 token 并导航到登录
    localStorage.removeItem('auth_token')
    window.location.href = '/login'
  }
}

getErrorHandlerChain().addHandler(new CustomErrorHandler())
```

### 在页面中使用搜索历史
```typescript
import { getPersistenceManager } from '@estay/shared'

function SearchPage() {
  const [history, setHistory] = useState([])
  
  useEffect(() => {
    const loadHistory = async () => {
      const persistence = getPersistenceManager()
      const searches = await persistence.getSearchHistories()
      setHistory(searches)
    }
    loadHistory()
  }, [])
  
  const handleSearch = async (query) => {
    const persistence = getPersistenceManager()
    await persistence.saveSearchHistory({
      id: Date.now().toString(),
      ...query,
      timestamp: Date.now()
    })
  }
  
  return (
    <div>
      <h2>搜索历史</h2>
      {history.map(h => (
        <div key={h.id}>{h.query} in {h.city}</div>
      ))}
    </div>
  )
}
```

---

## 🎯 性能建议

1. **中间件优化**: 避免在 onRequest 中进行重操作
2. **持久化批量操作**: 合并多个 setItem 调用
3. **Store 订阅**: 使用 Zustand 的 shallow 比较减少重渲染
4. **配置缓存**: getConfig() 返回浅拷贝，避免过度调用

---

## 🧪 测试建议

```typescript
// Store 测试
describe('HotelStore', () => {
  beforeEach(() => resetHotelStore())
  
  it('should initialize only once', () => {
    initHotelStore(mockApi)
    initHotelStore(mockApi)  // 第二次被忽略
    // 验证只初始化一次
  })
  
  it('should throw if not initialized', () => {
    expect(() => useHotelStore()).toThrow()
  })
})

// 中间件测试
describe('LoggingMiddleware', () => {
  it('should log requests and responses', async () => {
    const middleware = createLoggingMiddleware()
    const spy = jest.spyOn(console, 'log')
    
    await middleware.onRequest({ method: 'GET', url: '/api' })
    
    expect(spy).toHaveBeenCalled()
  })
})

// 错误处理测试
describe('ErrorFactory', () => {
  it('should create business error from HTTP 404', () => {
    const error = ErrorFactory.fromHttpStatus(404)
    expect(error.code).toBe(ErrorCode.NOT_FOUND)
  })
})

// 持久化测试
describe('PersistenceManager', () => {
  it('should save and retrieve search history', async () => {
    const mgr = getPersistenceManager()
    const search = { /* ... */ }
    
    await mgr.saveSearchHistory(search)
    const history = await mgr.getSearchHistories()
    
    expect(history).toContainEqual(search)
  })
})
```

---

**最后更新**: 2024年  
**框架版本**: 1.0.0  
**完成度**: Option B ✅ 100%
