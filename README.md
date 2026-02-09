# E-Stay 酒店预订系统 - 移动端项目

## 📱 项目概述

E-Stay 移动端是一个跨平台酒店预订应用，目标支持 **Web H5** 和 **微信小程序** 两个平台。项目采用 **monorepo 架构**，使用 `pnpm workspaces` 管理依赖，通过共享业务层（shared）实现两个平台间的代码复用。

### 关键特性

✅ **单一代码库** - Web、小程序共用一套业务逻辑和 UI 组件  
✅ **平台适配** - 自动适配不同平台的 API（localStorage vs Taro.storage）  
✅ **工厂函数模式** - 所有服务（API、Store、Hook）都支持依赖注入  
✅ **完整功能** - 城市搜索、酒店列表、详情查看、排序筛选

---

## 📁 项目结构

```
mobile/
├── shared/          # 共享业务层（两平台通用）
├── web/             # Web H5 应用（React + Vite）
├── taro/            # WeChat 小程序（Taro 3 + React）
├── package.json     # 根包配置（pnpm workspaces）
├── pnpm-workspace.yaml
└── README.md        # 本文件
```

### 各子项目功能一览

| 项目 | 技术栈 | 用途 | 平台 |
|------|--------|------|------|
| **shared** | TypeScript, Zustand, React Query | 共享业务逻辑、API、数据管理 | 两平台通用 |
| **web** | React 18, Vite, React Router | Web H5 用户界面与交互 | 浏览器 |
| **taro** | Taro 3, React, WeChat SDK | 小程序用户界面与交互 | 微信小程序 |

---

## 🚀 快速开始

### 前置条件

- **Node.js** >= 16  
- **pnpm** >= 8.0（推荐使用，自动支持 workspaces）

### 安装依赖

```bash
# 在 mobile 目录下
cd mobile
pnpm install
```

### 开发启动

**启动 Web H5 开发服务器：**
```bash
pnpm dev:web
# 访问 http://localhost:5174
```

**启动 Taro 小程序编译（watch 模式）：**
```bash
pnpm dev:taro
# 使用微信开发者工具打开 taro/dist 目录
```

**构建 Shared 共享层：**
```bash
pnpm build:shared
# 生成 shared/dist 目录
```

### 生产构建

```bash
# Web 生产构建
pnpm build:web

# Taro 小程序生产构建
pnpm build:taro

# Shared 类库构建
pnpm build:shared
```

---

## 📋 开发注意事项

### 1. 依赖管理

- **shared** 中的改动会影响 web 和 taro，务必测试两个平台
- 安装新依赖应该在对应子项目目录内运行：`pnpm add -D <package>`
- 工作区依赖默认链接，无需发布 npm

### 2. 环境变量

**Web 项目** (`web/.env`)：
```
VITE_API_URL=http://localhost:3000/api
```

**Taro 项目** (`taro/config/index.js`)：
```javascript
API_BASE_URL: () => process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api'
  : 'https://api.estay.com/api'
```

### 3. 图片/资源

- **Web**: 放在 `web/src/assets/` 或 `web/public/`
- **Taro**: 放在 `taro/src/assets/`，编译时自动处理

### 4. 样式

- **Web**: 使用 CSS Modules + Tailwind CSS
- **Taro**: 使用纯 CSS，自动生成 `.wxss` 小程序样式文件

### 5. API 调用

所有 API 调用通过 `shared/src/services/api.ts` 中的工厂函数：
```typescript
import { createApiInstance } from '@estay/shared'

// Web 中
const api = createApiInstance(baseUrl, localStorage)

// Taro 中
const api = createApiInstance(baseUrl, taroStorage)
```

### 6. 状态管理

使用 Zustand store，支持持久化适配器：
```typescript
// 自动持久化到平台对应的存储
const searchStore = createPersistentSearchStore(storage)
```

---

## 🔧 常见问题

**Q: 修改 shared 后 web/taro 没有更新**  
A: shared 使用 TypeScript 编译到 dist，修改后需运行 `pnpm build:shared`

**Q: Taro 编译错误 "找不到页面实例"**  
A: 确保页面组件正确导出且在 `app.config.ts` 的 pages 数组中声明

**Q: Web 中的样式在 Taro 中失效**  
A: Taro 不支持所有 CSS 特性，需要转换为小程序兼容的样式（参见各自 README）

**Q: API 请求超时**  
A: 检查后端服务是否运行，后端应该在 http://localhost:3000

---

## 📚 详细文档

- [**shared/** 详细说明](./shared/README.md) - 业务逻辑层架构
- [**web/** 详细说明](./web/README.md) - Web 项目结构与组件
- [**taro/** 详细说明](./taro/README.md) - Taro 小程序项目结构

---

## 🎯 项目规划

### 已完成

✅ 共享业务层（API、Store、Hook、工具函数）  
✅ Web H5 完整页面实现  
✅ Taro 小程序完整页面实现  
✅ 两平台功能及样式对齐

### 待优化

- [ ] 图片加载优化（懒加载、CDN）
- [ ] 性能监控与错误上报
- [ ] 离线模式支持
- [ ] PWA 支持（Web）
- [ ] 测试覆盖（单元、E2E）

---

## 🤝 协作规范

1. 在 shared 中实现通用逻辑，确保两个平台都能使用
2. Platform-specific 代码放在各自 `src/adapters/` 目录
3. Commit 前运行 `pnpm type-check` 检查 TypeScript 错误
4. Pull Request 需要两个平台都测试通过

---
