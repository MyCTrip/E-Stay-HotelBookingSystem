## 📚 概述

Shared 是 E-Stay 项目的**核心业务层**，为 Web H5 和 Taro 小程序提供 **通用的 API 调用、数据管理和工具函数**。

### 设计原则

✅ **平台无关** - 所有代码不依赖特定平台 API  
✅ **工厂函数模式** - 支持依赖注入，便于测试和适配  
✅ **ESM 输出** - 使用现代 ES 模块格式  
✅ **类型安全** - 完整的 TypeScript 类型定义

---

## 📁 项目结构

```
shared/
├── src/
│   ├── services/              # API 和业务服务
│   │   ├── api.ts            # HTTP 客户端工厂
│   │   ├── hotel.ts          # 酒店业务服务
│   │   └── room.ts           # 房间业务服务
│   │
│   ├── stores/                # Zustand 状态管理
│   │   └── searchStore.ts    # 搜索条件存储（支持持久化）
│   │
│   ├── hooks/                 # React Hook 工厂
│   │   ├── useCities.ts      # 城市列表 Hook
│   │   ├── useHotelList.ts   # 酒店列表 Hook
│   │   └── useHotelDetail.ts # 酒店详情 Hook
│   │
│   ├── utils/                 # 工具函数
│   │   ├── format.ts         # 格式化函数 (价格、日期、评分)
│   │   └── cn.ts             # className 工具
│   │
│   ├── types/                 # 类型定义
│   │   └── storage.ts        # IStorage 接口
│   │
│   └── index.ts              # 主入口，导出所有公共 API
│
├── dist/                      # 编译输出（自动生成）
├── tsconfig.json             # TypeScript 配置
├── package.json
└── README.md
```

---

## 🔌 API 服务

### `createApiInstance(baseUrl, storage)`

**工厂函数** 创建一个配置好的 Axios 实例，可自动处理 token 管理。

#### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `baseUrl` | string | API 基础 URL，如 `http://localhost:3000/api` |
| `storage` | IStorage | 存储适配器（localStorage 或 Taro.storage） |

#### 返回值

返回 Axios 实例，支持以下方法：
```typescript
interface AxiosInstance {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>
}
```

#### 使用示例

**Web 中使用：**
```typescript
import { createApiInstance } from '@estay/shared'

const api = createApiInstance(
  'http://localhost:3000/api',
  window.localStorage
)

// 发送请求
const response = await api.get('/hotels')
```

**Taro 中使用：**
```typescript
import { createApiInstance } from '@estay/shared'
import taroStorage from '../adapters/storage'

const api = createApiInstance(
  'http://localhost:3000/api',
  taroStorage
)
```

#### 自动功能

- 🔑 **Token 管理** - 自动从存储读取 token 并添加到请求头
- 🔄 **Token 刷新** - 如果收到 401 响应，自动刷新 token（如果可用）
- ⚠️ **错误处理** - 统一处理 HTTP 错误和网络错误

---

## 🏨 酒店服务

### `createHotelService(api)`

创建酒店业务层，封装所有酒店相关的 API 调用。

#### 方法

**`searchHotels(params)`** - 搜索酒店
```typescript
const hotels = await hotelService.searchHotels({
  city: 'Beijing',
  checkIn: '2024-01-01',
  checkOut: '2024-01-02',
  guests: 2,
  page?: 1,
  limit?: 10,
  sortBy?: 'price', // 'price' | 'rating' | 'popularity'
  sortOrder?: 'asc'  // 'asc' | 'desc'
})

// 返回
{
  data: Hotel[],
  total: number,
  page: number,
  limit: number
}
```

**`getHotelDetail(hotelId)`** - 获取酒店详情
```typescript
const hotel = await hotelService.getHotelDetail('hotel-123')

// 返回完整 Hotel 对象，包括：
// - 基本信息（名称、位置、评分）
// - 房间列表
// - 服务政策
// - 图片库等
```

**`getHotels()`** - 获取所有酒店（暂不分页）
```typescript
const hotels = await hotelService.getHotels()
```

#### Hotel 类型定义

```typescript
interface Hotel {
  id: string
  name: string
  city: string
  address: string
  rating: number        // 0-5
  price: number        // 最低价格，单位人民币
  description: string
  images: string[]
  facilities: string[] // 设施列表
  policies: Policy[]   // 政策详情
  rooms: Room[]        // 房间列表
}

interface Policy {
  title: string
  content: string
}

interface Room {
  id: string
  name: string
  beds: string
  size: number        // 平方米
  maxGuests: number
  price: number       // 每晚价格
  originalPrice?: number  // 原价（用于显示折扣）
  images: string[]
}
```

---

## 🛏️ 房间服务

### `createRoomService(api)`

封装房间相关的操作。

#### 方法

**`getRoomDetail(roomId)`** - 获取房间详细信息
```typescript
const room = await roomService.getRoomDetail('room-456')

// 返回 Room 对象，包含完整的图片、设备、床型等信息
```

**`checkAvailability(roomId, checkIn, checkOut)`** - 检查可用性
```typescript
const available = await roomService.checkAvailability(
  'room-456',
  '2024-01-01',
  '2024-01-05'
)
```

---

## 📦 状态管理

### `createSearchStore()`

创建搜索条件 Zustand store（不持久化）

```typescript
import { createSearchStore } from '@estay/shared'

const searchStore = createSearchStore()

// 读取状态
const { city, checkIn, checkOut, guests } = searchStore.getState()

// 更新状态
searchStore.setState({
  city: 'Shanghai',
  guests: 1
})

// 监听变化
const unsubscribe = searchStore.subscribe(
  (state) => console.log('搜索条件已更新:', state),
  (state) => state.city  // 仅在 city 改变时触发
)
```

#### 状态结构

```typescript
interface SearchState {
  city: string
  checkIn: string        // YYYY-MM-DD 格式
  checkOut: string
  guests: number
  
  // 列表视图的排序和分页
  sortBy?: 'price' | 'rating' | 'popularity'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
```

### `createPersistentSearchStore(storage)`

创建搜索条件 store，支持持久化

```typescript
import { createPersistentSearchStore } from '@estay/shared'

// Web 中
const searchStore = createPersistentSearchStore(window.localStorage)

// Taro 中
const searchStore = createPersistentSearchStore(taroStorage)

// 使用方式同上，状态自动保存和恢复
```

#### 持久化细节

- 存储键：`_estay_search`
- 初始化时：尝试从存储恢复状态
- 每次 setState 时：自动同步到存储
- 可手动调用 `clear()` 清除存储数据

---

## 🎣 React Hooks

所有 Hook 都是通过 **工厂函数** 创建的，支持传入自定义配置。

### `createUseCities(api)`

创建城市列表 Hook。

```typescript
import { createUseCities } from '@estay/shared'
import api from './services/api'

const useCities = createUseCities(api)

// 在组件中使用
function CitySelector() {
  const { data: cities, isLoading, error } = useCities()
  
  if (isLoading) return <div>加载中...</div>
  if (error) return <div>加载失败</div>
  
  return (
    <select>
      {cities?.map(city => (
        <option key={city.id} value={city.name}>{city.name}</option>
      ))}
    </select>
  )
}
```

**返回值**（React Query UseQueryResult）：
```typescript
{
  data: City[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
  isPending: boolean
}
```

### `createUseHotelList(api)`

创建酒店列表 Hook，支持搜索参数。

```typescript
const useHotelList = createUseHotelList(api)

function HotelListPage() {
  const searchParams = {
    city: 'Beijing',
    checkIn: '2024-01-01',
    checkOut: '2024-01-02',
    page: 1,
    limit: 10,
    sortBy: 'price'
  }
  
  const query = useHotelList(searchParams)
  
  if (query.isLoading) return <Spinner />
  
  return (
    <div>
      {query.data?.data.map(hotel => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
      <Pagination
        page={query.data?.page}
        total={query.data?.total}
      />
    </div>
  )
}
```

**缓存行为**：
- 相同参数 5 分钟内使用缓存
- 失败请求自动重试 3 次
- 缓存过期时自动重新获取

### `createUseHotelDetail(api)`

创建酒店详情 Hook，需要传入 hotelId。

```typescript
const useHotelDetail = createUseHotelDetail(api)

function HotelDetailPage({ hotelId }) {
  const query = useHotelDetail(hotelId)
  
  if (query.isLoading) return <Spinner />
  if (!query.data) return <div>酒店不存在</div>
  
  const hotel = query.data
  
  return (
    <div>
      <h1>{hotel.name}</h1>
      <HotelImages images={hotel.images} />
      <RoomList rooms={hotel.rooms} />
      <PolicySection policies={hotel.policies} />
    </div>
  )
}
```

---

## 🛠️ 工具函数

### `formatPrice(price)`

格式化价格为 CNY 货币格式。

```typescript
import { formatPrice } from '@estay/shared'

formatPrice(1999)     // "¥1,999"
formatPrice(999.5)    // "¥999.50"
formatPrice(0)        // "免费"
```

### `formatDate(date, format)`

格式化日期。

```typescript
import { formatDate } from '@estay/shared'

formatDate('2024-01-01')         // "01月01日 周一"
formatDate('2024-01-01', 'short') // "01-01"
formatDate('2024-01-01', 'full')  // "2024年1月1日 星期一"
```

### `formatRating(rating)`

格式化评分。

```typescript
import { formatRating } from '@estay/shared'

formatRating(4.5)     // "4.5分"
formatRating(0)       // "暂无评分"
```

### `daysBetween(startDate, endDate)`

计算两个日期之间的天数。

```typescript
import { daysBetween } from '@estay/shared'

daysBetween('2024-01-01', '2024-01-05')  // 4
```

### `cn(...classes)`

合并 className，类似 classnames 库。

```typescript
import { cn } from '@estay/shared'

const className = cn(
  'px-4 py-2',
  isActive && 'bg-blue-500',
  isDisabled && 'opacity-50'
)
```

---

## 💾 存储接口（IStorage）

为了支持多平台，Shared 定义了通用的存储接口：

```typescript
interface IStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
  clear(): void
}
```

### Web 实现

```typescript
// 直接使用 window.localStorage
import api from './services/api'
const api = createApiInstance(baseUrl, window.localStorage)
```

### Taro 实现

```typescript
// src/adapters/storage.ts
export const taroStorage: IStorage = {
  getItem: (key) => Taro.getStorageSync(key) || null,
  setItem: (key, value) => Taro.setStorageSync(key, value),
  removeItem: (key) => Taro.removeStorageSync(key),
  clear: () => Taro.clearStorageSync()
}
```

---

## 🏗️ 构建与发布

### 开发模式

编译到 dist/（支持热更新）：
```bash
pnpm build
```

### 输出说明

编译后的 `dist/` 目录结构：
```
dist/
├── services/
│   ├── api.js
│   ├── hotel.js
│   └── room.js
├── stores/
│   └── searchStore.js
├── hooks/
│   ├── useCities.js
│   ├── useHotelList.js
│   └── useHotelDetail.js
├── utils/
│   ├── format.js
│   └── cn.js
├── types/
│   └── storage.d.ts
└── index.js  # 主入口
```

### 依赖更新

```bash
# 检查更新
pnpm update

# 安装新依赖（在 shared 目录下）
pnpm add lodash
```

---

## 🧪 使用示例

### 完整搜索流程

```typescript
// 初始化
import { 
  createApiInstance, 
  createHotelService,
  createSearchStore 
} from '@estay/shared'

const api = createApiInstance('http://localhost:3000/api', storage)
const hotelService = createHotelService(api)
const searchStore = createSearchStore()

// React 组件中
import { createUseHotelList } from '@estay/shared'
const useHotelList = createUseHotelList(api)

export function SearchFlow() {
  const [params, setParams] = useState({
    city: 'Beijing',
    checkIn: '2024-01-01',
    checkOut: '2024-01-05'
  })
  
  const hotelQuery = useHotelList({
    ...params,
    page: 1,
    limit: 20
  })
  
  return (
    <div>
      <SearchForm onChange={setParams} />
      <HotelList hotels={hotelQuery.data?.data} />
    </div>
  )
}
```

### 跨平台使用

两个平台中，仅需改变存储适配器，其他代码完全相同：

```typescript
// Web
import api from './services/api'  // 使用 localStorage

// Taro
import api from './services/api'  // 使用 Taro.storage (通过适配器)

// 业务组件代码完全相同
import { useHotelList } from './hooks/useHotelList'
```

---

## 📋 导出清单

Shared 的 index.ts 导出了所有公共 API：

```typescript
// 服务工厂
export { createApiInstance } from './services/api'
export { createHotelService } from './services/hotel'
export { createRoomService } from './services/room'

// 状态管理
export { createSearchStore } from './stores/searchStore'
export { createPersistentSearchStore } from './stores/searchStore'

// Hook 工厂
export { createUseCities } from './hooks/useCities'
export { createUseHotelList } from './hooks/useHotelList'
export { createUseHotelDetail } from './hooks/useHotelDetail'

// 工具函数
export { formatPrice, formatDate, formatRating, daysBetween } from './utils/format'
export { cn } from './utils/cn'

// 类型定义
export type { IStorage } from './types/storage'
export type { Hotel, Room, Policy, City } from '@estay/api-types'
```

---

## ❓ 常见问题

**Q: 如何在 Shared 中添加新服务？**  
A: 在 `src/services/` 中创建新文件，导出工厂函数，然后在 `index.ts` 中导出

**Q: 修改后其他平台没有更新**  
A: 运行 `pnpm build` 重新编译

**Q: 如何处理 API 错误？**  
A: 使用 try-catch 或 React Query 的 `error` 属性处理

**Q: 能否自定义 Hook 的缓存时间？**  
A: 可以，Hook 工厂函数接受配置参数（详见源码中的 useQuery 选项）

**Q: Zustand store 能否用在类组件中？**  
A: 建议使用函数组件，类组件中可用 useEffect + subscribe 手动处理

---

## 🚀 性能优化建议

1. **缓存策略** - 合理设置 React Query 的 staleTime，避免频繁请求
2. **代码分割** - 每个工厂函数独立编译，支持 tree-shaking
3. **请求去重** - 相同请求会自动去重（由 React Query 处理）
4. **批量操作** - 避免在循环中创建 Hook，应该在组件顶层创建

---
