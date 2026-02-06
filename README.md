E-Stay Mobile — 项目说明

本文档简要说明 `mobile/` 子项目的技术栈、项目结构、各目录/文件作用以及本地运行方法，便于团队成员快速上手开发与扩展。

**一、技术栈**

- 框架：React 18 + TypeScript
- 打包/开发工具：Vite
- 路由：react-router-dom
- 服务端状态与缓存：@tanstack/react-query
- 本地状态：Zustand
- 列表优化：react-window
- 样式：TailwindCSS + PostCSS + Autoprefixer
- 网络请求：axios（在 `src/services/api.ts` 中封装）
- 代码规范：ESLint + Prettier（项目已有配置建议补充）

**二、快速开始（本地运行）**
前提：确保 `pc-backend` 在 `http://localhost:3000` 运行以便 API 可用。

```bash
cd mobile
pnpm install
pnpm dev
# 在浏览器打开 http://localhost:5173/
```

打包生产：

```bash
pnpm build
pnpm preview
```

**三、项目结构（重要文件/目录）**

```
mobile/
├── package.json # 依赖与脚本
├── vite.config.ts # Vite 配置
├── tsconfig.json # TypeScript 配置
├── tailwind.config.cjs # Tailwind 配置
├── postcss.config.cjs # PostCSS 配置
├── index.html # 入口 HTML
├── src/
│ ├── main.tsx # 应用入口（挂载 React Query / Router）
│ ├── App.tsx # 路由入口与顶层布局
│ ├── styles/ # 全局样式与 Tailwind 引用
│ │ └── index.css
│ ├── pages/ # 页面目录（按页面拆分子目录）
│ │ ├── Home/ # 首页（搜索入口、Banner）
│ │ ├── HotelList/ # 酒店列表页（分页/筛选/卡片）
│ │ └── HotelDetail/ # 酒店详情页（图片轮播、房型列表、设施/政策）
│ ├── components/ # 可复用 UI 组件（HotelCard、RoomCard、DatePicker 等）
│ ├── services/ # API 封装
│ │ └── api.ts # axios 实例（baseURL 指向后端）
│ ├── stores/ # 全局轻量状态（Zustand）
│ ├── hooks/ # 自定义 Hook（useLazyImage、usePriceRefresh 等）
│ ├── utils/ # 工具函数（format、cache、geo 等）
│ └── types/ # TypeScript 类型声明（如 api.d.ts）
├── README.md # 本文件
└── .gitignore
```

**四、各目录/文件说明与开发指引**

- `src/pages/`：页面级组件，每个页面使用独立子目录（便于路由、样式、测试集中管理）。
  - `Home`：实现顶部 Banner、核心查询区（城市/日期/人数/关键字）、快捷标签与“查询”按钮。
  - `HotelList`：实现顶部筛选 Summary、筛选面板、虚拟列表（`react-window`）、上拉分页（或无限加载）、列表项卡片（`components/HotelCard`）。
  - `HotelDetail`：酒店大图轮播、基础信息（名称/星级/地址）、设施/政策入口、房型列表（按价格升序）、房间详情入口。

- `src/components/`：小而美的可复用组件库。
  - `HotelCard`：列表项卡片，包含缩略图、名称、地址、评分、最低价和优惠标签。
  - `RoomCard`：房型卡片，展示房名、床型、面积、容纳人数、价格与订购按钮。
  - `DatePicker`：移动端友好的日期范围选择器（建议使用自研或轻量第三方，需禁用过去日期并展示夜数）。
  - `ImageGallery`：图片轮播组件，可用现成库或基于 CSS 做简单实现。

- `src/services/api.ts`：axios 实例，默认 baseURL 指向 `http://localhost:3000/api`。所有后端请求统一在 `src/services/*` 中封装，便于添加 token 拦截器、错误统一处理与重试逻辑。

- `src/stores/`：使用 `zustand` 管理本地搜索条件、收藏列表、UI 状态（模态框展开/折叠）等轻量级状态。跨页面共享状态（如搜索条件）放这里。

- `src/hooks/`：自定义 hook 集中地。例如 `useLazyImage`（懒加载）、`usePriceRefresh`（定时或 WebSocket 的价格刷新）、`useInfiniteHotels`（结合 React Query 的分页钩子）。

- `src/styles/index.css`：Tailwind 指令与一些容器/安全区样式，`tailwind.config.cjs` 中配置内容扫描路径。

- `vite.config.ts`：开发服务器端口、插件（`@vitejs/plugin-react`）等，开发时可添加 proxy 以转发 API 请求到后端：
  ```ts
  // vite.config.ts 中可配置
  server: {
  	proxy: { '/api': 'http://localhost:3000' }
  }
  ```

**五、与后端接口对接要点（参考 `pc-backend` 已实现接口）**

- 城市列表：`GET /api/hotels/cities`（缓存 24 小时）
- 热门酒店（首页）：`GET /api/hotels/hot?limit=10`（缓存 1 小时）
- 酒店列表：`GET /api/hotels?city=&search=&limit=&page=`（缓存 5 分钟）
- 酒店详情/房型：`GET /api/hotels/:id`、`GET /api/hotels/:id/rooms`

前端注意：后端模型中 `Hotel.baseInfo` 与 `Room.baseInfo` 中已经包含 `facilities` 与 `policies` 的 HTML 内容，前端渲染富文本时仍应使用安全策略（例如 DOMPurify）或 React 的受控渲染方式，避免 XSS。后端已做净化，但前端加一层更稳妥。

**六、开发建议与最佳实践**

- 使用 `@tanstack/react-query` 管理服务端数据缓存，设置合理的 `staleTime` 与 `retry` 策略，配合 `react-window` 做长列表虚拟化。
- 将搜索条件（城市/日期/人数/标签）放入 `zustand`，并持久化到 `localStorage`（短期缓存），以便页面间共享与回退。
- 图片使用缩略图作为列表占位，详情页再加载高分辨率图片，结合 `useLazyImage` 实现懒加载与占位模糊效果。
- 想要高分：把时间投入到 1) 列表虚拟化与稳定的分页；2) React Query 的缓存与价格刷新；3) 移动端视觉细节（骨架屏、流畅动效、间距与安全区）。

**七、常见命令**

- 安装依赖：`pnpm install`
- 启动开发：`pnpm dev`
- 生成生产：`pnpm build`
- 本地预览：`pnpm preview`

---
