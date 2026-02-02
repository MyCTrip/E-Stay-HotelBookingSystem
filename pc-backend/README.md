## ✨ 项目简介

这是 E‑Stay 酒店预订平台的 **PC 管理后台（后端）实现**，用于平台治理（账号管理、商户与酒店管理、审核与审计日志等）。

## ✅ 核心特性

- 用户认证（JWT）与角色权限（Admin / Merchant）
- 商户与酒店的 CRUD 与审核流程
- 审计日志记录平台操作与审核行为
- 基于 TypeScript 的结构化代码与中间件支持

## 🔧 技术栈

- Node.js (>=18) + TypeScript
- Express
- MongoDB + Mongoose
- JWT
- Zod

## 接口与使用方法
`docs/API/README.md`（包含请求示例与测试说明）
## 📁 目录结构

```
src/
├─ app.ts                # Express 应用实例：挂载路由、全局中间件；供测试直接 import
├─ server.ts             # 启动脚本：加载 env、连接 DB、启动监听
├─ config/               # 配置（db.ts / env.ts / jwt.ts）：封装连接与配置常量
├─ middlewares/          # 中间件集合（鉴权/角色校验/请求校验/错误处理等）
├─ modules/              # 业务模块（每个模块含 model/controller/routes/service/schema）
│  ├─ auth/              # 用户注册 / 登录 / me
│  ├─ merchant/          # 商户资料：upsert / submit / admin approve/reject
│  ├─ hotel/             # 酒店：创建 / 提交 / 管理审批 / 下线
│  ├─ room/              # 房型：创建 / 提交 / 管理审批
│  ├─ admin/             # 管理端：单体审批 / 批量审批 / 审计日志接口
│  └─ audit/             # 审计日志模型与查询接口
├─ utils/                # 通用工具（logger、格式化等）
└─ tests/                # 集成测试（Jest + supertest + mongodb-memory-server）

scripts/                 # 手动 E2E 脚本（scripts/test-api.js：面向真实 Mongo 的 smoke 测试）
docs/                    # 文档（docs/API.md：接口说明与示例）
package.json             # 脚本与依赖
README.md
```

详细说明:

- `src/app.ts`：创建 Express app、挂载路由与全局中间件（logger、cors、json body parser）、导出 app（用于测试）。
- `src/server.ts`：程序入口，负责 DB 连接与监听端口（生产/本地启动用）。
- `src/config/db.ts`：封装 Mongoose 连接逻辑；`env.ts` 加载并验证环境变量；`jwt.ts` 导出 jwtSecret 与过期配置。
- `src/middlewares/*`：
  - `auth.middleware.ts`：解析并验证 JWT，将 `user` 注入 req；
  - `role.middleware.ts`：`requireRole()` 等角色校验；
  - `validate.middleware.ts`：用 Zod 做请求体验证并返回 400 错误；
  - `error.middleware.ts`：集中错误处理与日志记录；
  - 额外中间件（例如 `merchant.middleware.ts` / `hotel.middleware.ts`）用于特定业务校验（如 `requireMerchantVerified` / `requireHotelApproved`）。
- `src/modules/<module>/`（每个模块遵循的一般约定）：
  - `*.model.ts`：定义 Mongoose schema 与 model（字段、索引、默认值、ref 等）；
  - `*.schema.ts`：Zod schema（请求体与参数校验），配合 `validateBody` 使用；
  - `*.routes.ts`：Router，负责路由映射、权限/校验中间件的组合；
  - `*.controller.ts`：HTTP handler（参数检查、错误处理、调用 service 或 model、发送响应）；
  - `*.service.ts`（可选）：封装复杂业务逻辑（原子更新、复用 DB 操作、事务管理等），便于单元测试。
- `src/utils/logger.ts`：winston 或其他 logger 的统一配置与导出。
- `scripts/test-api.js`：方便在真实 Mongo 上跑一遍全流程的 smoke 脚本（默认不清理数据，便于调试）；可扩展为 `KEEP_DB`/`--clean` 选项。
- `tests/integration/`：Jest + supertest 测试文件，使用 mongodb-memory-server 启动内存 Mongo，测试前清空 collections，测试后停止实例，确保 CI 可重复运行且不依赖外部 DB。
- `docs/API.md`：接口文档与示例请求（curl），便于前端与运维查阅。

---

## 快速开始（本地开发）

先决条件：Node.js v18+, pnpm, MongoDB

1. 进入仓库并安装依赖：

```bash
cd pc-admin
pnpm install
```

2. 新建并配置环境变量（`.env`）：

```env
MONGO_URI=mongodb://localhost:27017/estay
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=development
```

3. 启动开发模式（支持热重载）：

```bash
pnpm run dev
```

4. 打包与生产运行：

```bash
pnpm run build
pnpm start
```

> 开发提示：首次运行会自动创建一个默认管理员（方便开发）。

## 🔑 默认管理员账号（开发用）

- Email: `admin@local`
- Password: `admin123`

## 📚 数据表结构设计

> 以下内容来自 `src/modules`，已与实际 Mongoose 模型保持一致。包含：字段名、类型、必填约束、枚举、索引、唯一/稀疏设置、默认值、关联与 timestamps 行为。

---

### User — 用户表 (`User`) ✅

**顶级字段**

- `_id` — ObjectId, **主键、唯一、非空**, 文档唯一标识
- `email` — String, **唯一、非空**, 用户邮箱，用于登录
- `password` — String, **非空**, 加密后的用户密码
- `role` — String, **非空**, enum: `['merchant','admin']`, 用户角色，商户 / 管理员
- `status` — String, **非空**, enum: `['active','disabled']`, 账户状态，启用 / 禁用
- timestamps: `createdAt`, `updatedAt`（非空、默认当前时间）

---

### MerchantProfile — 商户资料表 (`MerchantProfile`) ✅

**顶级字段**

- `userId` — ObjectId, **必填**, ref: `User`
- `baseInfo` — 子文档, **必填**
- `qualificationInfo` — 子文档, 可选, 默认 `{}`
- `auditInfo` — 子文档, 可选, 默认 `{}`
- timestamps: `createdAt`, `updatedAt`

**baseInfo（商户基础联系信息）**

- `merchantName` — String, **必填**
- `contactName` — String, **必填**
- `contactPhone` — String, **必填**
- `contactEmail` — String, **必填**

**qualificationInfo（资质 / 实名）**

- `businessLicenseNo` — String, 可选, **唯一 (unique) 且稀疏 (sparse)**
- `idCardNo` — String, 可选, **唯一 (unique) 且稀疏 (sparse)**
- `realNameStatus` — String, **必填**, enum: `['unverified','verified','rejected']`, default: `'unverified'`

**auditInfo（审核状态）**

- `verifyStatus` — String, **必填**, enum: `['unverified','pending','verified','rejected']`, default: `'unverified'`
- `rejectReason` — String, 可选

---

### AdminProfile — 管理员资料表 (`AdminProfile`) 🛡️

**顶级字段**

- `userId` — ObjectId, **必填**, ref: `User`
- `baseInfo` — 子文档, **必填**
- timestamps: **仅维护** `createdAt`

**baseInfo（管理员信息）**

- `name` — String, **必填**
- `employeeNo` — String, 可选, **唯一 (unique) 且稀疏 (sparse)**

---

### Hotel — 酒店主表 (`Hotel`) 🏨

**顶级字段**

- `merchantId` — ObjectId, **必填**, ref: `MerchantProfile`
- `baseInfo` — 子文档, **必填**
- `checkinInfo` — 子文档, 可选, 默认 `{}`
- `auditInfo` — 子文档, 可选, 默认 `{}`
- timestamps: `createdAt`, `updatedAt`

**baseInfo（酒店基础信息）**

- `nameCn` — String, **必填**
- `nameEn` — String, 可选
- `address` — String, **必填**
- `city` — String, **必填**, **带索引 (index)**
- `star` — Number, **必填**
- `openTime` — String, **必填**（文本）
- `roomTotal` — Number, **必填**
- `phone` — String, **必填**
- `description` — String, **必填**
- `images` — String[], **必填**

**checkinInfo（入住 / 早餐）**

- `checkinTime` — String, **必填**
- `checkoutTime` — String, **必填**
- `breakfastType` — String, 可选
- `breakfastPrice` — Number, 可选

**auditInfo（酒店审核）**

- `status` — String, **必填**, enum: `['draft','pending','approved','rejected','offline']`, default: `'draft'`
- `auditedBy` — ObjectId, 可选, ref: `AdminProfile`, **带索引 (index)**, default: `null`
- `auditedAt` — Date, 可选, default: `null`
- `rejectReason` — String, 可选

---

### Room — 房间主表 (`Room`) 🛏️

**顶级字段**

- `hotelId` — ObjectId, **必填**, ref: `Hotel`, **带索引 (index)**
- `baseInfo` — 子文档, **必填**
- `headInfo` — 子文档, **必填**
- `bedInfo` — 子文档数组, **必填**（至少为空数组不可缺失）
- `breakfastInfo` — 子文档, 可选, 默认 `{}`
- `auditInfo` — 子文档, 可选, 默认 `{}`
- timestamps: `createdAt`, `updatedAt`

**baseInfo（房型核心信息）**

- `type` — String, **必填**
- `price` — Number, **必填**, min: `0`
- `images` — String[], **必填**
- `status` — String, **必填**, enum: `['draft','pending','approved','rejected','offline']`
- `maxOccupancy` — Number (整数), **必填**, min: `0`

**headInfo（房间属性）**

- `size` — String, **必填**（如 `25 sqm`）
- `floor` — String, **必填**
- `wifi` — Boolean, **必填**
- `windowAvailable` — Boolean, **必填**
- `smokingAllowed` — Boolean, **必填**

**bedInfo（床型数组）**

- 每项：
  - `bedType` — String, **必填**
  - `bedNumber` — Number, **必填**
  - `bedSize` — String, **必填**

**breakfastInfo（房间早餐）**

- `breakfastType` — String, 可选
- `cuisine` — String, 可选
- `bussinessTime` — String, 可选
- `addBreakfast` — String, 可选

**auditInfo（房间审核）**

- `auditedBy` — ObjectId, 可选, ref: `AdminProfile`, **带索引 (index)**, default: `null`
- `auditedAt` — Date, 可选, default: `null`
- `rejectReason` — String, 可选

---

### AuditLog — 审计日志表 (`AuditLog`) 🔍

- 维护：仅 `createdAt`（timestamps）
- `targetType` — String, **必填**, enum: `['hotel','merchant','room']`
- `targetId` — ObjectId, **必填**, **带索引 (index)**, ref: 对应集合主键
- `action` — String, **必填**, enum: `['approve','reject','offline']`
- `operatorId` — ObjectId, **必填**, ref: `AdminProfile`, **带索引 (index)**
- `reason` — String, 可选

---
