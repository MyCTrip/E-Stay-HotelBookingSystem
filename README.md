
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
- JWT（鉴权）
- Zod（校验，可选）

## 📁 目录结构（简要）

```
src/
├─ app.ts
├─ server.ts
├─ config/      # 数据库、环境与 JWT 配置
├─ middlewares/ # 身份认证、权限、错误处理
├─ modules/     # 按业务拆分：auth, admin, merchant, hotel, audit, ...
└─ utils/       # 日志等工具
```

## 🚀 快速开始（本地开发）

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

