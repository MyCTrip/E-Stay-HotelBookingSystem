# E-Stay 移动端框架

🎉 **项目状态**：框架开发完成（5 页面 + 完整路由 + 统一状态管理）

完整的 Monorepo 酒店预订移动端应用开发框架。支持 Web H5 和微信小程序双端。

## 技术栈

### Web H5 端
- **框架**：React 18 + TypeScript
- **构建**：Vite 4.5
- **路由**：React Router 6
- **样式**：CSS Modules + SCSS
- **状态管理**：Zustand
- **数据获取**：TanStack React Query 5
- **包管理**：pnpm

### Mini-Program 端
- **框架**：Taro 4.1.11 + React 18 + TypeScript
- **编译目标**：微信小程序（WeChat)
- **样式**：CSS Modules + SCSS
- **状态管理**：Zustand
- **数据获取**：TanStack React Query 5
- **包管理**：pnpm

### Shared 共享层
- **类型定义**：TypeScript 接口 + 类型
- **API 层**：工厂函数 + 依赖注入
- **状态管理**：Zustand store 工厂
- **平台适配**：Storage、网络请求等适配层


  
## 📁 项目结构

### 整体架构

```
mobile/
├── packages/
│   ├── shared/              # 📦 共享业务层（核心 - 两平台通用）
│   │   ├── src/
│   │   │   ├── api/                 # API 服务工厂
│   │   │   │   ├── types.ts         # 接口定义（Hotel, Room, Search, etc）
│   │   │   │   ├── factory.ts       # 工厂函数 createApiService()
│   │   │   │   ├── mockImpl.ts       # Mock 实现（开发用）
│   │   │   │   └── README.md        # API 文档
│   │   │   │
│   │   │   ├── stores/              # Zustand 状态管理
│   │   │   │   ├── hotelStore.ts    # 酒店数据 Store
│   │   │   │   ├── index.ts         # Store 导出
│   │   │   │   └── README.md        # Store 文档
│   │   │   │
│   │   │   ├── adapters/            # 平台适配层
│   │   │   │   ├── storage.ts       # Storage 接口 + Web/Taro 实现
│   │   │   │   └── index.ts         # 适配器导出
│   │   │   │
│   │   │   ├── types/               # TypeScript 类型定义
│   │   │   │   ├── models.ts        # Hotel, Room, User 等数据模型
│   │   │   │   ├── api.ts           # API 请求/响应类型
│   │   │   │   └── index.ts         # 类型导出
│   │   │   │
│   │   │   ├── utils/               # 工具函数库
│   │   │   │   ├── formatters.ts    # formatPrice(), formatDate()
│   │   │   │   ├── validators.ts    # 数据验证函数
│   │   │   │   └── index.ts         # 工具导出
│   │   │   │
│   │   │   └── index.ts             # 主导出文件
│   │   │
│   │   ├── package.json             # @estay/shared 包配置
│   │   └── tsconfig.json            # TS 配置
│   │
│   ├── mini-program/        # 📱 微信小程序（Taro 4.1.11 + React 18）
│   │   ├── src/
│   │   │   ├── layouts/
│   │   │   │   ├── MainLayout.tsx           # 主布局（Header + Main + Footer + Nav）
│   │   │   │   └── MainLayout.module.scss   # 布局样式
│   │   │   │
│   │   │   ├── pages/               # 5 个页面（与 web-h5 对标）
│   │   │   │   ├── Home/
│   │   │   │   │   ├── index.tsx            # 首页搜索表单
│   │   │   │   │   ├── index.module.scss    # 首页样式
│   │   │   │   │   └── index.config.ts     # 页面配置
│   │   │   │   ├── SearchResult/
│   │   │   │   │   ├── index.tsx            # 搜索结果列表
│   │   │   │   │   ├── index.module.scss
│   │   │   │   │   └── index.config.ts
│   │   │   │   ├── HotelDetail/
│   │   │   │   │   ├── index.tsx            # 酒店详情
│   │   │   │   │   ├── index.module.scss
│   │   │   │   │   └── index.config.ts
│   │   │   │   ├── RoomDetail/
│   │   │   │   │   ├── index.tsx            # 房间详情
│   │   │   │   │   ├── index.module.scss
│   │   │   │   │   └── index.config.ts
│   │   │   │   └── NotFound/
│   │   │   │       ├── index.tsx            # 404 页面
│   │   │   │       ├── index.module.scss
│   │   │   │       └── index.config.ts
│   │   │   │
│   │   │   ├── router/              # 路由配置
│   │   │   │   └── index.ts         # 统一路由配置（ROUTE_CONFIG, navigate）
│   │   │   │
│   │   │   ├── app.ts               # 小程序入口
│   │   │   ├── app.scss             # 全局样式
│   │   │   └── app.config.ts        # 全局配置
│   │   │
│   │   ├── public/                  # 静态资源
│   │   ├── config/                  # Taro 编译配置
│   │   ├── project.config.json      # 小程序项目配置
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── jest.config.js
│   │
│   └── web-h5/              # 🌐 Web H5（Vite + React Router 6）
│       ├── src/
│       │   ├── layouts/
│       │   │   ├── MainLayout.tsx           # 主布局（与小程序对应）
│       │   │   ├── HeaderLayout.tsx         # 头部组件
│       │   │   └── MainLayout.module.css
│       │   │
│       │   ├── pages/               # 5 个页面（与 mini-program 对标）
│       │   │   ├── Home/
│       │   │   │   ├── index.tsx
│       │   │   │   └── index.module.css
│       │   │   ├── SearchResult/
│       │   │   ├── HotelDetail/
│       │   │   ├── RoomDetail/
│       │   │   └── NotFound/
│       │   │
│       │   ├── components/          # 可复用组件
│       │   │   ├── HotelCard.tsx
│       │   │   ├── SearchForm.tsx
│       │   │   └── ...
│       │   │
│       │   ├── hooks/               # 自定义 hooks
│       │   │   ├── useHotels.ts
│       │   │   └── ...
│       │   │
│       │   ├── router/
│       │   │   └── index.ts         # React Router 配置
│       │   │
│       │   ├── App.tsx              # 根组件
│       │   ├── App.css
│       │   ├── main.tsx             # 入口文件
│       │   └── index.css            # 全局样式
│       │
│       ├── index.html
│       ├── package.json
│       ├── vite.config.ts
│       └── tsconfig.json
│
├── 📄 pnpm-workspace.yaml   # Monorepo 工作区配置（定义 packages）
├── 📄 tsconfig.base.json    # 共享 TypeScript 配置（path aliases）
├── 📄 .eslintrc.json        # ESLint 通用配置
├── 📄 .prettierrc.json      # Prettier 格式化配置
├── 📄 QUICK_REFERENCE.md    # 快速参考文档
├── 📄 README.md             # 本文件
└── 📄 package.json          # 根包配置
```

### 关键目录说明

| 目录 | 说明 | 内容 |
|------|------|------|
| `packages/shared` | 共享业务层 | API、Store、类型、工具、平台适配 |
| `packages/mini-program` | 小程序端 | Taro + React 实现，5 个页面 |
| `packages/web-h5` | Web 端 | React Router 实现，5 个页面 |
| `.eslintrc.json` | 代码检查 | 统一的代码规范 |

### 数据流向

```
页面 (Home, SearchResult, etc)
  ↓
自定义 Hook (useHotelStore)
  ↓
Zustand Store (hotelStore)
  ↓
API 服务 (createApiService)
  ↓
后端 API 或 Mock 数据
```

## 架构特点

### 1. **Monorepo 单仓多包**
```
mobile/
├── packages/shared      ← 核心业务逻辑（两端共享）
├── packages/mini-program ← 小程序实现
└── packages/web-h5      ← Web 实现
```
### 2. **业务逻辑**
```
共享层（Shared Package）
  ├── API 接口定义
  ├── Zustand Store（状态管理）
  ├── Types（类型定义）
  ├── Utils（工具函数）
  └── Adapters（平台适配）
       ↓
两端独立实现（相同业务逻辑，不同 UI 框架）
       ↓
    Web端             小程序端
(React Router)    (Taro Pages)
```
### 3. **工厂函数 + 依赖注入模式**
```typescript
// API 层：工厂函数创建服务实例
const api = createApiService({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000
})

// Store 层：接收 API 实例
const useHotelStore = createHotelStore(api)

优势：
✅ 易于 Mock 测试（注入 mock api）
✅ 易于切换实现（注入不同的 api）
✅ 易于扩展（工厂函数可加参数）
```

### 4. **平台适配策略**
```typescript
// 存储适配层
registerStorage(webStorageImpl)  // Web: localStorage
// 或
registerStorage(createTaroStorageImpl(Taro))  // 小程序: Taro.getStorage

// 业务逻辑层无需感知平台差异
const data = useStorage.getItem('key')  // 自动调用对应实现
```

## 🚀 快速开始

### 前置条件

- Node.js >= 18
- pnpm >= 8.0

### 安装依赖

```bash
cd mobile
pnpm install
```

### 开发启动

**启动 Web H5**：
```bash
pnpm dev:web
# 访问 http://localhost:5174
```

**启动小程序编译（watch 模式）**：
```bash
pnpm dev:mini
# 使用微信开发者工具打开 packages/mini-program/dist 目录
```

### 生产构建

```bash
# 构建所有
pnpm build

# 单独构建
pnpm build:web
pnpm build:mini
```


## 📋 架构设计

### 分层模型

```
Pages (页面容器)
    ↓
Hooks (数据 hooks)
    ↓
Stores (Zustand 状态管理)
    ↓
API Services (工厂函数模式)
```

### 核心特性

✅ **Monorepo 管理** - pnpm workspaces 统一管理多个包  
✅ **代码复用** - shared 层集中维护，两端共享  
✅ **工厂函数模式** - 便于 Mock 测试和依赖注入  
✅ **平台适配** - storage 适配层自动处理平台差异  
✅ **类型安全** - 全 TypeScript，类型推断完善  
✅ **状态管理** - Zustand 轻量级，API 简洁  
✅ **数据缓存** - TanStack Query (React Query) 集成  

## 📦 开发工作流

### 1. API 层

维护 `packages/shared/src/api/`：
- 定义 `IApiService` 接口
- 实现 `createApiService()` 工厂函数
- 提供 Mock API 实现

```typescript
const api = createApiService({
  baseURL: 'http://localhost:3000/api'
})
```

### 2. 状态管理

维护 `packages/shared/src/stores/`：
- 定义 Store 状态结构
- 实现 State Actions
- 编写 Store 工厂函数

```typescript
const useHotelStore = createHotelStore(api)
```

### 3. 页面开发

在各子端中开发页面：
```
packages/web-h5/src/pages/
packages/mini-program/src/pages/
```

使用统一的 Hook 获取数据：
```typescript
const { hotels, loading } = useHotelStore()
```

## 🔧 共享模块

### Types (类型定义)

```typescript
import { Hotel, Room, HotelQuery } from '@estay/shared'
```

### Utils (工具函数)

```typescript
import { formatPrice, calculateNights, formatDate } from '@estay/shared'
```

### Adapters (平台适配)

```typescript
import { registerStorage, webStorageImpl, createTaroStorageImpl } from '@estay/shared'

// Web
registerStorage(webStorageImpl)

// Taro
registerStorage(createTaroStorageImpl(Taro))
```

## 🌟 核心技术亮点

### 代码对齐策略
```
Web H5 (React Router 6)          Mini-Program (Taro Pages)
         ↓                               ↓
共享业务层 (业务逻辑 100% 相同)
     ↙  ↙  ↙  ↙
  API Store Types Utils
```

- **业务逻辑一致**：两端使用相同的 Store、API、Types
- **框架适配**：Root 页面结构不同，但数据层完全共享
- **路由配置**：统一的 ROUTE_CONFIG，两端独立实现导航

### 页面对标关系

| 功能 | Web H5 | Mini-Program | 共享状态 |
|------|--------|--------------|---------|
| 首页搜索 | Home | Home | ✅ useHotelStore |
| 列表展示 | SearchResult | SearchResult | ✅ useHotelStore |
| 酒店详情 | HotelDetail | HotelDetail | ✅ useHotelStore |
| 房间详情 | RoomDetail | RoomDetail | ✅ useHotelStore |
| 404 页面 | NotFound | NotFound | ✅ React Router |


## 🎯 项目进度

### ✅ 已完成

1. ✅ 框架搭建 - Monorepo 完整配置
2. ✅ 共享层实现 - shared 包完整（API、Store、Types、Utils、Adapters）
3. ✅ Web H5 应用 - 完整 5 页面 React 实现（Home, SearchResult, HotelDetail, RoomDetail, 404）
4. ✅ Mini Program 重构 - 代码结构与 web-h5 完全对标
5. ✅ 业务逻辑一致性 - 两端使用相同的 Store 和 API 层
6. ✅ 统一路由配置 - Router 配置集中管理（ROUTE_CONFIG, ROUTES, PAGE_ROUTES）
7. ✅ MainLayout 集成 - 所有 5 页面完整包装（Header+Main+Footer+MobileNav）
8. ✅ Build 成功 - 248 modules, 20.32s（无错误）


## 🎨 MainLayout 集成说明

### 架构模式

Web H5 使用 `<Outlet />` 进行嵌套路由，而 Mini-Program 使用全页面模型。

**解决方案**：每个页面使用 MainLayout 包装内容

```tsx
// pages/Home/index.tsx
export default function HomePage() {
  return (
    <MainLayout>
      <View className={styles.container}>
        {/* 页面内容 */}
      </View>
    </MainLayout>
  )
}
```

### MainLayout 组件结构

```tsx
<MainLayout>
  ├── Header (导航栏)
  │   └── Logo + Category Tabs
  ├── Main (主内容区)
  │   └── {children} ← 每个页面的内容
  ├── MobileNav (移动导航)
  │   └── Category Icons
  └── Footer (页脚)
      └── Copyright
</MainLayout>
```

### 样式文件

- 所有页面都有 `index.module.scss` 配置
- MainLayout 有 `MainLayout.module.scss` 全局样式
- 使用 CSS Modules 避免样式冲突

## 📝 命名规范

- **文件**：camelCase (e.g., `hotelStore.ts`)
- **组件**：PascalCase (e.g., `HotelCard.tsx`)
- **类型**：PascalCase (e.g., `Hotel`, `Room`)
- **常量**：CONSTANT_CASE (e.g., `API_TIMEOUT`)
- **Store**：`useXxxStore` (e.g., `useHotelStore`)

## 📄 License

MIT
