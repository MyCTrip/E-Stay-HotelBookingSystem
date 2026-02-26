# E-Stay 易宿酒店预订平台

本仓库为 E-Stay（易宿）酒店预订平台的 Monorepo，包含 PC 管理后台（前端/后端）与移动端框架（Web H5 与小程序）。本 README 将整合各子项目的简介、技术栈与快速启动指引。

## 演示视频
<video width="800" controls>
  <source src=".\mobile\assets\152ca8a80c8d445e38056ac7b127f679.mp4" type="video/mp4">
  你的浏览器不支持视频播放，请点击链接查看：<a href="./assets/演示视频.mp4">视频链接</a>

</video>

**子项目概览**
- **pc-frontend:** 商家与管理员的 PC 端管理后台（React + TypeScript + Vite）。详情见 [pc-frontend/README.md](pc-frontend/README.md).
- **pc-backend:** 后端服务（Node.js + Express + TypeScript + MongoDB），含认证、审核、审计与缓存等中间件。详情见 [pc-backend/README.md](pc-backend/README.md).
- **mobile:** 移动端 Monorepo 框架，支持 Web H5（Vite + React）和微信小程序（Taro + React）。详情见 [mobile/README.md](../mobile/README.md).

**总体技术栈（概览）**
- 前端（PC 管理后台）: React 18, TypeScript, Vite, Ant Design
- 后端（API）: Node.js (>=18), TypeScript, Express, MongoDB, Redis
- 移动端: Web H5 (React + Vite)、Mini-Program (Taro + React)、共享层使用 Zustand + React Query
- 包管理: pnpm (workspaces)

**目录结构（高层）**

```
E-Stay-HotelBookingSystem/
├─ pc-frontend/    # 商家/管理员后台前端
├─ pc-backend/     # 后端服务
└─ mobile/            # 移动端 monorepo（shared / web-h5 / mini-program）     
└─ README.md

```

**快速开始（Monorepo 根目录）**
1. 安装依赖：

```bash
pnpm install
```

2. 进入并启动子项目示例：

```bash
# 启动后端（在 pc-backend 目录）
cd E-Stay-HotelBookingSystem/pc-backend
pnpm install
pnpm run dev

# 启动前端（在 pc-frontend 目录）
cd ../pc-frontend
pnpm install
pnpm run dev

# 启动移动端 dev（在 mobile 目录）
cd ../../mobile
pnpm install
pnpm dev:web   # 或 pnpm dev:mini
```

（各子项目内的 README 包含更详细的运行与配置说明）

**文档与进一步阅读**
- 后端接口文档：参见 `pc-backend/docs/API/`。
- 子项目说明：
	- [E-Stay-HotelBookingSystem/pc-frontend/README.md](pc-frontend/README.md)
	- [E-Stay-HotelBookingSystem/pc-backend/README.md](pc-backend/README.md)
	- [mobile/README.md](../mobile/README.md)

