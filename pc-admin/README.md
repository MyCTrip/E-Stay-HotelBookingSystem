Markdown
# 🏨 E-Stay 易宿酒店预订平台 - 商家管理后台 (PC Admin)

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
│   ├── MainLayout/index.tsx # 主后台布局 (Sider + Header + Content)
│   └── UserLayout/         # 登录/注册页布局
├── pages/                  # [核心] 页面视图 (与后端 modules 对应)
│   ├── auth/               # >> 对应后端 auth.routes.ts
│   │   ├── Login/          # 登录
│   │   └── Register/       # 注册 (商户/管理员)
│   ├── merchant/           # >> 对应后端 merchant.routes.ts
│   │   ├── Profile/        # 商户资料 (Create/Read/Update)
│   │   └── HotelEntry/rooms/{HotelForm.tsx、HotelLayout.tsx、index.tsx、Manage.tsx、index.module.scss}   # 酒店录入/编辑 (Hotel CRUD)
│   ├── admin/              # >> 对应后端 admin.routes.ts
│   │   ├── HotelAudit/     # 酒店审核列表
│   │   ├── AuditLog/       # 审计日志 (GET /api/admin/audit-logs)
│   └── dashboard/          # 仪表盘 (不同角色的首页)
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


📘 管理后台协同开发指南 (E-Stay Admin)
版本：1.0 目的：统一团队开发风格，确保布局一致、组件复用最大化，并严格遵守前后端数据对接规范。

1. 核心布局规范 (Layout & Menu) 
为了保持系统视觉一致性，所有业务页面必须遵循以下嵌套规则：

1.1 全局布局
组件：src/layouts/MainLayout/index.tsx
说明：这是系统的最外层壳，包含左侧 Sidebar 和顶部 Header。所有业务路由都必须是它的子路由。
文件位置：src/config/menu.tsx
规则：新增模块时，请在此文件添加菜单项。key 必须与路由的绝对路径一致（用于菜单高亮）。

1.2 模块级布局 (Tab 容器模式)
对于“列表 + 新建”高频切换的业务模块（如酒店管理、订单管理），不要让用户跳页，请使用 Tab 容器布局。

参考组件：src/pages/merchant/HotelEntry/HotelLayout.tsx

实现方式：
创建一个父组件（Layout），负责渲染顶部的 Tab（如 List | Create）。
使用 <Outlet /> 渲染下方的内容。
点击 Tab 时使用 Maps 切换路由，实现无刷新切换体验。

2. 数据对接规范 (Data Structure) 
后端接口（Mongoose）返回的数据通常是嵌套结构，前端组件必须严格适配，严禁私自扁平化导致数据丢失。

2.1 实体结构标准
我们在开发组件（Table/Form）时，读取数据必须遵循以下路径：
基础信息：data.baseInfo.nameCn
状态/审核：data.auditInfo.status
图片数组：data.baseInfo.images

2.2 提交数据标准
在提交表单（Create/Update）时，必须将扁平的表单数据组装回嵌套结构：

TypeScript
// Payload 示例
const payload = {
  baseInfo: {
    nameCn: values.nameCn, // 从表单读取
    city: values.city,
    ...
  },
  auditInfo: { status: 'draft' }, // 补全必要字段
  // ...
}
3. 组件复用策略 (Component Reuse) 
为了减少重复代码，请优先采用以下模式：

3.1 表单大一统模式 (Unified Form)
原则：不要拆分 Create.tsx 和 Edit.tsx，维护两份相似的 UI 是巨大的浪费。
规范：创建一个全能表单组件（如 HotelForm.tsx）。

逻辑：
通过 useParams() 获取 id。
无 ID - 新建模式：显示空表单，保存调用 create 接口。
有 ID - 编辑模式：调用 getDetail 回显数据，保存调用 update 接口。

3.2 常用公共组件
开发新页面前，请先检查是否可复用以下组件：
QueryOptions：列表页顶部的搜索框、筛选器、排序组件。
PageLoader：全屏或局部加载时的 Loading 状态。
ImageUpload (待封装)：统一处理图片上传到 file server 的逻辑。

4. 路由配置规范 (Routing) 
路由文件位于 src/router/index.tsx。请保持路由层级清晰。

推荐的路由结构
TypeScript
{
  path: 'merchant/resource', // 模块根路径
  element: <ResourceLayout />, // 1. 渲染带 Tab 的父容器
  children: [
    { index: true, element: <ResourceList /> }, // 2. 默认显示列表
    { path: 'new', element: <ResourceForm /> }, // 3. 新建 (复用 Form)
    { path: ':id/edit', element: <ResourceForm /> }, // 4. 编辑 (复用 Form)
    { path: ':id', element: <ResourceDetail /> }, // 5. 详情
  ]
}
5. 新增模块 SOP (开发清单) 
当开发一个新的业务模块（例如“员工管理”）时，请按此步骤操作：

新建目录：在 src/pages/ 下建立模块文件夹。

创建核心文件：
ManagerLayout.tsx (Tab 容器)
ManagerList.tsx (列表页，注意 data.baseInfo 读取)
ManagerForm.tsx (新建/编辑二合一，注意 payload 组装)

配置路由：在 src/router/index.tsx 注册上述组件，使用嵌套路由。
配置菜单：在 src/config/menu.tsx 添加入口。

目前 src/pages/merchant/HotelEntry 是最新的样板代码（Best Practice）。如果你在开发中遇到布局或数据结构的问题，请直接参考该目录下的 HotelLayout.tsx 和 HotelForm.tsx 实现。