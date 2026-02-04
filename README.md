Markdown

# 🏨 E-Stay 易宿酒店预订平台 - 商家管理后台hlx (PC Admin)

> 第五期前端训练营大作业 - 商家与管理员端 PC 站点

本项目是“易宿酒店预订平台”的 **PC 端管理后台**。主要服务于 **酒店商户**（录入房源）和 **平台管理员**（审核房源）。采用 React + TypeScript + Vite 最新技术栈开发。

## 🛠 技术栈 (Tech Stack)

- **核心框架**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**: [Vite 5](https://vitejs.dev/)
- **UI 组件库**: [Ant Design 5.x](https://ant.design/)
- **路由管理**: [React Router DOM v6](https://reactrouter.com/) (配置式路由)
- **CSS 预处理**: SCSS + CSS Modules (BEM 命名规范)
- **HTTP 请求**: Axios (封装拦截器)
- **包管理器**: pnpm

## 📂 项目目录结构 (Project Structure)

本项目采用 **领域驱动 (Domain-Driven)** 的目录结构，将商户端、管理员端和认证模块物理隔离，便于维护。

```text
src/
├── assets/                 # 静态资源 (Logo, 缺省图)
├── components/             # [全局] 通用组件
│   ├── AuthGuard/          # 路由守卫 (根据 User role 控制权限)
│   ├── ImageUpload/        # 图片上传组件 (对接后端上传接口)
│   └── StatusTag/          # 状态标签 (用于显示 Verified/Pending/Rejected)
├── config/                 # 全局配置
│   ├── constants.ts        # 常量定义 (映射后端的 status 枚举)
│   └── menu.tsx            # 左侧菜单配置 (区分 Merchant 和 Admin)
├── hooks/                  # [全局] 自定义 Hooks
│   └── useAuth.ts          # 获取当前用户信息, 处理 Login/Logout
├── layouts/                # 布局组件
│   ├── MainLayout/         # 主后台布局 (Sider + Header + Content)
│   └── UserLayout/         # 登录/注册页布局
├── pages/                  # [核心] 页面视图 (与后端 modules 对应)
│   ├── auth/               # >> 对应后端 auth.routes.ts
│   │   ├── Login/          # 登录
│   │   └── Register/       # 注册 (商户/管理员)
│   ├── merchant/           # >> 对应后端 merchant.routes.ts
│   │   ├── Profile/        # 商户资料 (Create/Read/Update)
│   │   └── HotelEntry/     # 酒店录入/编辑 (Hotel CRUD)
│   ├── admin/              # >> 对应后端 admin.routes.ts
│       ├── HotelAudit/     # 酒店审核列表# 审计日志 (GET /api/admin/audit-logs)
│             └──Audit3     # 三种审核，merchants/hotels/rooms
│             └──           # dashboard，日志页面
├── router/                 # 路由配置
│   └── index.tsx           # 集中式路由定义
├── services/               # API 接口层 (Axios 封装)
│   ├── request.ts          # Axios 实例 (Token 拦截器)
│   ├── auth.ts             # 登录注册 API
│   ├── merchant.ts         # 商户相关 API
│   ├── hotel.ts            # 酒店 CRUD API
│   └── admin.ts            # 审核相关 API
├── types/                  # TypeScript 类型定义 [严格对齐后端 Model]
│   ├── api.d.ts            # 通用接口响应格式
│   ├── user.d.ts           # User & MerchantProfile 类型
│   └── hotel.d.ts          # Hotel & Room 类型
├── utils/                  # 工具函数
│   ├── format.ts           # 日期/金额格式化
│   └── storage.ts          # localStorage (Token 存取)
├── App.tsx
└── main.tsx
```
