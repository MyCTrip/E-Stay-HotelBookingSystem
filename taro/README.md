## 📱 概述

Taro 是 E-Stay 项目的 **微信小程序版本**，基于 **Taro 3.6.38** 框架，使用 **React** 作为 UI 框架。Taro 可将同一份代码编译到多个小程序平台（WeChat、Alipay、ByteDance 等），本项目重点面向微信小程序。

### 关键特性

✅ **代码复用** - 与 Web 共享 90% 的业务逻辑（通过 shared 层）  
✅ **平台适配** - 自动转换小程序组件和 API  
✅ **性能优化** - 按需编译，最小化包体积  
✅ **开发者友好** - 支持热更新和 DevTools 调试

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Taro | 3.6.38 | 小程序框架 |
| React | 18 | UI 框架 |
| TypeScript | 5 | 类型安全 |
| React Query | 5 | 数据管理 |
| Zustand | 4 | 状态管理 |

---

## 📁 项目结构

```
taro/
├── src/
│   ├── pages/                 # 小程序页面
│   │   ├── home/             # 首页 (搜索、热标签、轮播)
│   │   │   ├── index.tsx
│   │   │   └── index.css
│   │   ├── hotelList/        # 酒店列表
│   │   │   ├── index.tsx
│   │   │   └── index.css
│   │   └── hotelDetail/      # 酒店详情
│   │       ├── index.tsx
│   │       └── index.css
│   │
│   ├── components/            # 可复用组件
│   │   └── (通常少于 Web)
│   │
│   ├── adapters/              # 平台适配层
│   │   └── storage.ts        # Taro 存储适配器
│   │
│   ├── config/                # 配置文件
│   │   ├── api.ts            # API 实例初始化
│   │   └── stores.ts         # Store 初始化
│   │
│   ├── app.tsx               # 小程序主入口
│   ├── app.config.ts         # 小程序配置 (pages、window 等)
│   ├── index.tsx             # React 注册
│   └── utils/                # 工具函数 (使用 shared 中的)
│
├── config/
│   ├── index.js              # 主 webpack 配置
│   ├── dev.js                # 开发环境特定配置
│   └── prod.js               # 生产环境特定配置
│
├── dist/                      # 编译输出（自动生成）
│   ├── pages/
│   │   ├── home/
│   │   │   ├── index.wxml    # WeChat 模板
│   │   │   ├── index.wxss    # WeChat 样式
│   │   │   ├── index.js      # 编译后的代码
│   │   │   └── index.json    # 页面配置
│   │   └── ...
│   ├── app.js, app.json, app.wxss
│   └── project.config.json
│
├── package.json
└── README.md
```

---

## 🚀 开发与构建

### 前置条件

- **Taro CLI** 已全局安装或在项目中
- **微信开发者工具** 用于预览和调试
- **Node.js** >= 16

### 开发模式

启动 Taro 编译服务（watch 模式）：

```bash
pnpm dev:taro
# 或
pnpm exec taro build --type weapp --watch
```

这会监听文件变化并实时编译，输出到 `dist/` 目录。

### 在微信开发者工具中打开

1. 打开微信开发者工具
2. 新建项目，选择"导入项目"
3. 项目目录：`<项目根>/taro`
4. AppID：使用测试号（可从菜单获取）
5. 确认后工具会自动加载 `dist/` 中的文件

### 生产构建

```bash
pnpm build:taro
# 实际编译命令：pnpm exec taro build --type weapp
```

生成的 `dist/` 可上传至微信小程序后台。

### 生成二维码

微信开发者工具中：右上角菜单 → 生成二维码

---

## ⚙️ 核心配置说明

### `app.config.ts` - 小程序全局配置

```typescript
export default defineAppConfig({
  pages: [
    'pages/home/index',        // 首页（必须第一个）
    'pages/hotelList/index',   // 列表页
    'pages/hotelDetail/index'  // 详情页
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'E-Stay',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    // 底部 tab 配置（可选）
  }
})
```

### `config/index.js` - Webpack 构建配置

**关键配置项目：**

```javascript
export default {
  projectName: 'taro-e-stay',
  date: '2024-02-09',
  designWidth: 750,        // 设计稿宽度（px）
  deviceRatio: {
    750: 1,               // 750px 的 DPI 比例
  },
  
  sourceRoot: 'src',
  outputRoot: 'dist',
  
  plugins: [],
  presets: [],
  
  defineConstants: {
    // 全局环境变量
  },
  
  mini: {
    // 小程序特定配置
    postcss: {
      pxtransform: {
        enable: false,    // ⚠️ 禁用自动 px→rpx 转换（避免 NaNpx）
        config: {}
      },
      url: {
        enable: true,
        config: { limit: 1024 }
      },
      cssModules: {
        enable: false,    // ⚠️ 禁用 CSS Modules（保留原始类名）
        config: {}
      }
    }
  }
}
```

**为什么禁用这两个功能？**

- **pxtransform** - 自动将 px 转换为 rpx（小程序单位），但配置不当会生成 NaNpx 值，导致样式失效
- **cssModules** - 会对类名进行 hash，导致编译后的 .wxml 文件中的类名与 .wxss 中不匹配

解决方案：禁用这两个，手动编写小程序兼容的样式。

### `config/dev.js` - 开发环境特定配置

```javascript
export default {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    API_BASE_URL: '"http://localhost:3000/api"'
  },
  mini: {}
}
```

### `config/prod.js` - 生产环境配置

```javascript
export default {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
    API_BASE_URL: '"https://api.estay.com/api"'
  },
  mini: {}
}
```

---

## 🎨 样式系统

### rpx 和 px 的区别

| 单位 | 说明 | 用途 |
|------|------|------|
| **rpx** | 小程序专用，相对像素（750rpx = 屏幕宽度） | 推荐，自动适配各屏幕 |
| **px** | 物理像素（绝对值） | 用于固定尺寸（如边框） |

### 样式编写

**✅ 推荐方式（手动编写 rpx）：**

```css
/* pages/home/index.css */
.container {
  width: 100%;
  padding: 30rpx;
  background-color: #f5f5f5;
}

.search-box {
  background: white;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.hotel-card {
  width: 100%;
  height: 200rpx;
  margin-bottom: 20rpx;
  border-radius: 15rpx;
  overflow: hidden;
}

.hotel-image {
  width: 100%;
  height: 140rpx;
  object-fit: cover;
}

.hotel-info {
  padding: 15rpx;
  background: white;
}

.hotel-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.hotel-price {
  font-size: 28rpx;
  color: #ff6b6b;
  margin-top: 10rpx;
}
```

**❌ 避免方式：**

```css
/* 不要使用已被禁用的功能 */
.box {
  width: 375px;         /* ❌ 使用 px 可能导致 NaNpx */
  padding: 20px;        /* ❌ 应该用 rpx */
}
```

### CSS 注意事项

1. **不支持的样式属性**
   - ❌ `::before`, `::after` 伪元素
   - ❌ 某些 CSS 3 特性
   - ❌ 背景图片（需用 image 标签）

2. **图片处理**
   ```tsx
   // ✅ 正确做法
   <Image className={styles.image} src={imageUrl} />
   
   // ❌ 错误做法，小程序中 background-image 不工作
   <View style={{ backgroundImage: `url(${imageUrl})` }} />
   ```

---

## 📄 核心页面说明

### 1. 首页 (`pages/home/index.tsx`)

**特殊要求：**
- 在顶层包装 `QueryClientProvider`（React Query 必需）
- 使用 Taro 组件（`View`, `Text`, `Input` 等）
- 点击事件使用 `navigateTo` 导航到其他页面

**代码结构：**
```tsx
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from '../../../config/queryClient'

export default function HomePage() {
  const handleSearch = () => {
    // 保存搜索条件到 store
    searchStore.setState({
      city: 'Beijing',
      checkIn: '2024-01-01'
    })
    
    // 导航到列表页
    Taro.navigateTo({
      url: '/pages/hotelList/index'
    })
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View className="home-container">
        <View className="banner">
          {/* 轮播、标题等 */}
        </View>
        <View className="search-section">
          <Input placeholder="目标城市" />
          <View onClick={handleSearch}>搜索</View>
        </View>
        <View className="hot-tags">
          {/* 热门城市标签 */}
        </View>
      </View>
    </QueryClientProvider>
  )
}
```

### 2. 酒店列表 (`pages/hotelList/index.tsx`)

**特点：**
- 获取搜索条件（来自 searchStore 或 URL 参数）
- 加载酒店列表（React Query Hook）
- 实现排序和分页
- 点击卡片跳转到详情页

**导航参数传递：**
```tsx
// 跳转时传递参数
Taro.navigateTo({
  url: `/pages/hotelDetail/index?id=${hotel.id}`
})
```

### 3. 酒店详情 (`pages/hotelDetail/index.tsx`)

**获取 URL 参数：**
```tsx
import { useRouter } from '@tarojs/taro'

function HotelDetailPage() {
  const router = useRouter()
  const hotelId = router.params.id  // 从 URL 获取

  const query = useHotelDetail(hotelId)
  
  // 渲染详情
}
```

---

## 🔌 存储适配器

### `src/adapters/storage.ts`

Taro 中需要自定义存储适配器以实现 `IStorage` 接口：

```typescript
import Taro from '@tarojs/taro'

export const taroStorage: IStorage = {
  getItem(key: string) {
    try {
      return Taro.getStorageSync(key)
    } catch (error) {
      console.error('Storage getItem error:', error)
      return null
    }
  },

  setItem(key: string, value: string) {
    try {
      Taro.setStorageSync(key, value)
    } catch (error) {
      console.error('Storage setItem error:', error)
    }
  },

  removeItem(key: string) {
    try {
      Taro.removeStorageSync(key)
    } catch (error) {
      console.error('Storage removeItem error:', error)
    }
  },

  clear() {
    try {
      Taro.clearStorageSync()
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }
}
```

### 使用示例

```typescript
import { createApiInstance } from '@estay/shared'
import { taroStorage } from './adapters/storage'

const api = createApiInstance(
  'http://localhost:3000/api',
  taroStorage
)
```

---

## 🧬 全局环境变量

### 问题背景

Zustand store 在编译时会尝试访问 `process.env.NODE_ENV`。如果未定义，会导致：

```
Error: CRITICAL - process.env.NODE_ENV is not defined
```

### 解决方案

在所有入口文件顶部定义全局变量：

**1. `src/index.tsx` (React 入口)**
```typescript
// ⚠️ 必须在所有其他导入前定义
if (typeof process === 'undefined') {
  (global as any).process = {
    env: {
      NODE_ENV: 'development'
    }
  } as any
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
// 其他导入...
```

**2. `src/app.tsx` (Taro App 组件)**
```typescript
if (typeof process === 'undefined') {
  (global as any).process = {
    env: {
      NODE_ENV: 'development'
    }
  } as any
}

import { Component } from 'react'
// 其他导入...

class App extends Component {
  // ...
}
```

**3. 所有页面组件 (pages/*/index.tsx)**
```typescript
if (typeof process === 'undefined') {
  (global as any).process = {
    env: {
      NODE_ENV: 'development'
    }
  } as any
}

export default function HomePage() {
  // ...
}
```

---

## 🎣 使用 React Query

### QueryClientProvider 配置

每个页面需要单独包装 `QueryClientProvider`：

```typescript
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from '../../../config/queryClient'

export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 页面内容 */}
    </QueryClientProvider>
  )
}
```

### 自定义 Hook（推荐）

```typescript
// src/hooks/useHotels.ts
import { createUseHotelList } from '@estay/shared'
import api from '../config/api'

export const useHotels = createUseHotelList(api)
```

然后在页面中使用：
```typescript
import { useHotels } from '../hooks/useHotels'

function ListPage() {
  const { data, isLoading } = useHotels({
    city: 'Beijing'
  })
}
```

---

## 📐 屏幕适配

### Safe Area（安全区）

处理刘海屏、底部导航栏等：

```typescript
import Taro from '@tarojs/taro'

function Page() {
  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync()
    const safeAreaInsets = systemInfo.safeArea
    
    console.log('Safe area bottom:', safeAreaInsets.bottom)
  }, [])

  return (
    <View style={{
      paddingBottom: safeAreaInsets.bottom + 'px'
    }}>
      {/* 内容 */}
    </View>
  )
}
```

### 屏幕宽度适配

使用 rpx 自动适配：

```css
/* 不需要手动计算，rpx 会自动转换 */
.container {
  width: 750rpx;        /* 总是屏幕宽度 */
  padding: 30rpx;       /* 在不同设备上成比例缩放 */
}
```

---

## 🚀 性能优化

### 代码分割

Taro 自动按页面分割代码：

```javascript
// 每个页面都是独立的 JS 文件
// pages/home/index.js
// pages/hotelList/index.js
// pages/hotelDetail/index.js
```

### 图片优化

```tsx
// ✅ 使用原生图片组件，自动优化
<Image
  src={imageUrl}
  style={{ width: '100%', height: '200rpx' }}
  lazyLoad={true}
  mode="aspectFill"
/>

// ❌ 避免过大的图片
<Image src={url} style={{ width: '750px' }} />  // 过大！
```

### 列表虚拟化

大列表使用虚拟滚动：

```tsx
// 对于 100+ 项的列表
import { ScrollView } from '@tarojs/components'

<ScrollView scrollY style={{ height: '100vh' }}>
  {items.map(item => (
    <HotelCard key={item.id} data={item} />
  ))}
</ScrollView>
```

---

## 🔍 调试

### 微信开发者工具调试

1. **Console 日志**
   ```typescript
   console.log('信息')        // 在下方 Console 标签显示
   console.warn('警告')
   console.error('错误')
   ```

2. **Sources 断点调试**
   - 打开 Sources 标签
   - 在代码行号点击设置断点
   - 刷新后会暂停在断点处
   - 可查看变量值和执行栈

3. **Taro DevTools**
   ```bash
   pnpm add -D @tarojs/plugin-mock
   # 然后在 config/index.js 中配置
   ```

### 网络请求调试

在微信开发者工具中：

1. 打开 Network 标签
2. 在网络请求上点击可查看详情
3. 响应数据直接显示

---

## ⚠️ 小程序限制

### API 限制

| API | 限制 |
|-----|------|
| 网络请求 | 仅支持 HTTPS（localhost 开发时例外） |
| 文件大小 | 单个包 2MB（整体不超过 20MB） |
| 存储空间 | 单个 key 最多 1MB，总共 10MB |
| 同时请求数 | 最多 10 个 |

### 路由限制

```typescript
// ✅ 支持的导航
Taro.navigateTo({ url: '/pages/detail/index?id=123' })

// ❌ 小程序没有 React Router
// 不支持 <Link> 或 useNavigate()

// 获取参数方式
function Page() {
  const route = useRoute()
  const id = route.params?.id
}
```

---

## 📱 小程序发布流程

1. **本地测试**
   - 在微信开发者工具中测试
   - 检查所有页面和功能

2. **构建生产版本**
   ```bash
   pnpm build:taro
   # 或设置 NODE_ENV=production
   ```

3. **上传代码**
   - 微信开发者工具 → 上传
   - 填写版本号和备注
   - 上传后后台审核

4. **提交审核**
   - 微信小程序后台
   - 填写应用信息和截图
   - 提交审核

5. **发布**
   - 审核通过后，选择发布
   - 用户即可搜索并下载

---

## 🐛 常见问题

**Q: 页面导航不工作**  
A: 确保使用 `Taro.navigateTo()`，not React Router。参数必须是注册的页面路径

**Q: 图片不显示**  
A: 使用 `<Image>` 组件而不是 `<img>`，并确保 URL 在 HTTPS 或微信域名下

**Q: 存储数据丢失**  
A: Taro 存储是同步的，避免在异步操作前访问。使用 async-await 确保时序正确

**Q: 样式不生效**  
A: 检查是否用了禁用的 cssModules 或 pxtransform。使用 rpx 单位而不是 px

**Q: 包体积过大**  
A: 检查是否有未使用的依赖。使用 `pnpm prune` 清理空依赖。按页面分割代码

**Q: Zustand store 报 process.env.NODE_ENV 错误**  
A: 在所有页面和入口文件顶部添加全局环境变量定义（见上面的"全局环境变量"部分）

**Q: React Query Hook 返回 undefined**  
A: 确保该页面被 QueryClientProvider 包装，且页面在小程序配置的 pages 数组中

---

## 📚 相关文档

- [Taro 官方文档](https://taro.jd.com/)
- [React Query 文档](https://tanstack.com/query/v5/)
- [Zustand 文档](https://github.com/pmndrs/zustand)
- [Shared 业务层文档](../shared/README.md)
- [Web H5 文档](../web/README.md)

---
