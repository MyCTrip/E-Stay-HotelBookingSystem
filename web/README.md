## 📱 概述

Web H5 是 E-Stay 酒店预订系统的浏览器版本，基于 **React 18** + **Vite** 构建，提供快速的开发体验和优化的生产构建。

### 核心技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18 | UI 框架 |
| React Router | 6 | 路由管理 |
| Vite | 4+ | 构建工具 |
| TypeScript | 5 | 类型安全 |
| Tailwind CSS | 3 | 样式框架 |
| Zustand | 4 | 状态管理 |
| React Query | 5 | 数据获取缓存 |
| Axios | 1.4+ | HTTP 客户端 |

---

## 📁 项目结构

```
web/
├── src/
│   ├── pages/                 # 页面组件
│   │   ├── Home/             # 首页 (搜索、热标签、轮播)
│   │   ├── HotelList/        # 酒店列表 (筛选、排序、分页)
│   │   ├── HotelDetail/      # 酒店详情 (信息、政策、预订)
│   │   ├── auth/             # 认证相关
│   │   ├── merchant/         # 商户相关
│   │   └── admin/            # 管理后台
│   │
│   ├── components/            # 可复用组件
│   │   ├── ImageUpload/      # 图片上传组件
│   │   ├── PageLoader/       # 页面加载器
│   │   ├── QueryOptions/     # 查询选项
│   │   ├── shared/           # 通用组件
│   │   └── user/             # 用户相关组件
│   │
│   ├── hooks/                 # 自定义 Hooks
│   │   └── useAuth.ts        # 认证 Hook
│   │
│   ├── layouts/               # 布局组件
│   │   └── MainLayout/       # 主布局
│   │
│   ├── stores/                # Zustand 状态管理
│   │   
│   ├── services/              # API 服务
│   │   ├── api.ts            # 通用 API 配置
│   │   ├── auth.ts           # 认证接口
│   │   ├── hotel.ts          # 酒店接口
│   │   ├── merchant.ts       # 商户接口
│   │   └── admin.ts          # 管理接口
│   │
│   ├── config/                # 配置文件
│   │   ├── constants.ts      # 全局常量
│   │   └── menu.tsx          # 菜单配置
│   │
│   ├── types/                 # TypeScript 类型定义
│   │   ├── api.d.ts          # API 响应类型
│   │   ├── hotel.d.ts        # 酒店相关类型
│   │   └── user.d.ts         # 用户相关类型
│   │
│   ├── utils/                 # 工具函数
│   │   ├── format.ts         # 格式化函数 (价格、日期等)
│   │   ├── storage.ts        # localStorage 存储
│   │   ├── notification.ts   # 通知提示
│   │   └── responseAsStatus.ts # 响应状态处理
│   │
│   ├── assets/                # 静态资源
│   │   └── data/             # 数据文件
│   │
│   ├── router/                # 路由配置
│   │   └── index.tsx         # 路由定义
│   │
│   ├── App.tsx               # 应用入口
│   ├── App.css               # 应用样式
│   ├── main.tsx              # 启动文件
│   └── index.css             # 全局样式
│
├── public/                    # 静态文件（直接复制）
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 配置
├── index.html                # HTML 入口
├── package.json
└── README.md
```

---

## 🚀 开发与构建

### 启动开发服务器

```bash
pnpm dev:web
# 开发服务器在 http://localhost:5174 启动
# HMR（热更新）自动启用
```

### 生产构建

```bash
pnpm build:web
# 输出到 dist/ 目录，自动优化和分块
```

### 预览生产构建

```bash
pnpm preview:web
# 本地预览生产构建结果
```

### 类型检查

```bash
pnpm type-check
# 运行 TypeScript 类型检查（不输出 JS 文件）
```

---

## 📄 核心页面说明

### 1. 首页 (`src/pages/Home/index.tsx`)

**功能模块：**
- **Banner 轮播** - 展示推广内容，渐变背景
- **搜索表单** - 输入目的地、入住日期、房间数
- **热门标签** - 快速筛选热门城市

**相关文件：**
- 页面组件：`pages/Home/index.tsx`
- 样式：`pages/Home/index.css`
- Hook 使用：`useCities()`, `useSearchStore()`

**状态流转：**
```
用户输入 → searchStore 更新 → 导航到 HotelList
```

### 2. 酒店列表 (`src/pages/HotelList/index.tsx`)

**功能模块：**
- **排序功能** - 支持价格(升序/降序)、评分、热度排序
- **其他筛选** - 星级、设施等（可扩展）
- **分页显示** - 一页 10 条，支持翻页
- **酒店卡片** - 显示图片、名称、价格、评分

**相关文件：**
- 页面组件：`pages/HotelList/index.tsx`
- API Hook：`useHotelList()` (来自 shared)
- Store 使用：`searchStore` (持久化搜索条件)

**数据流：**
```
searchStore 条件 → useHotelList 请求 → 后端返回 → React Query 缓存 → 列表渲染
```

### 3. 酒店详情 (`src/pages/HotelDetail/index.tsx`)

**功能模块：**
- **图库展示** - 酒店多张图片轮播
- **基本信息** - 名称、位置、评分、价格
- **房间类型** - 列表展示可预订房间
- **服务政策** - 取消政策、入住政策、设施说明
- **预订按钮** - 跳转至预订流程

**相关文件：**
- 页面组件：`pages/HotelDetail/index.tsx`
- API Hook：`useHotelDetail()` (来自 shared)

**加载流程：**
```
URL 参数 (hotelId) → useHotelDetail(id) → 后端查询 → 数据展示
```

---

## 🔌 API 集成

### API 初始化

```typescript
// src/config/api.ts 中
import { createApiInstance } from '@estay/shared'

const api = createApiInstance(
  process.env.VITE_API_URL || 'http://localhost:3000/api',
  window.localStorage
)

export default api
```

### 使用 API 服务

```typescript
// 示例：获取酒店列表
import { createHotelService } from '@estay/shared'

const hotelService = createHotelService(api)
const hotels = await hotelService.searchHotels({
  city: 'Beijing',
  checkIn: '2024-01-01',
  checkOut: '2024-01-02'
})
```

### 数据缓存（React Query）

```typescript
// 所有 Hook 自动集成 React Query
// 支持 staleTime、cacheTime、重试等配置
const { data, isLoading, error } = useHotelList({
  city: 'Beijing',
  page: 1,
  limit: 10
})
```

---

## 🎨 样式系统

### Tailwind CSS 配置

Web 项目使用 Tailwind CSS 提供原子化样式：

```html
<!-- 示例 -->
<div className="bg-white rounded-lg shadow p-4">
  <h1 className="text-2xl font-bold mb-2">标题</h1>
  <p className="text-gray-600">描述文本</p>
</div>
```

### CSS Modules

部分页面使用 CSS Modules 管理长样式：

```typescript
import styles from './index.css'

export default function Page() {
  return <div className={styles.container}>...</div>
}
```

---

## 💾 状态管理

### Zustand 

**搜索条件存储：** (`src/stores/searchStore.ts`)
```typescript
const searchStore = createPersistentSearchStore(localStorage)

// 读取
const { city, checkIn, checkOut } = searchStore.getState()

// 更新
searchStore.setState({ city: 'Shanghai' })

// 监听变化
const unsubscribe = searchStore.subscribe(state => {
  console.log('搜索条件已更新:', state)
})
```

**持久化自动保存** 到 `localStorage`，刷新页面数据不丢失

### React Query

所有数据获取通过 React Query Hook：

```typescript
// 自动处理 loading/error/data 状态
// 自动重试失败请求
// 自动缓存和去重
const query = useHotelList({ city, page, limit })

if (query.isLoading) return <Spinner />
if (query.error) return <ErrorMessage />
return <HotelList hotels={query.data} />
```

---

### 受保护路由

```typescript
// router/index.tsx 中配置
{
  element: <PrivateRoute />,
  children: [
    { path: '/merchant', element: <MerchantPage /> },
    { path: '/admin', element: <AdminPage /> }
  ]
}
```

---



---

## 📚 相关文档

- [Shared 业务层文档](../shared/README.md)
- [Taro 小程序文档](../taro/README.md)
- [主项目 README](../README.md)

---