## ✨ 项目简介

这是 E‑Stay 酒店预订平台的 **PC 管理后台（后端）实现**，用于平台治理（账号管理、商户与酒店管理、审核与审计日志等）。

## ✅ 核心特性

- 用户认证（JWT）与角色权限（Admin / Merchant）
- 商户与酒店的 CRUD 与审核流程
- 审计日志记录平台操作与审核行为
- 基于 TypeScript 的结构化代码与中间件支持
- API 请求频率限制，防止暴力破解和 API 滥用
- Redis 缓存机制，提升查询性能和响应速度
- 图片自动压缩和尺寸调整，减少存储空间和传输时间
- MongoDB 复合索引和全文搜索，优化数据库查询性能
- 商户资料完整性验证（营业执照号、身份证号格式验证）
- XSS 防护，使用 DOMPurify 净化 HTML 富文本内容

## 🔧 技术栈

- Node.js (>=18) + TypeScript
- Express
- MongoDB + Mongoose
- JWT
- Zod
- DOMPurify + jsdom
- Redis (缓存和频率限制)
- Sharp (图片处理)

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
│  └─ upload/            # 图片上传接口（upload.controller.ts / upload.routes.ts）
│  ├─ admin/             # 管理端：单体审批 / 批量审批 / 审计日志接口
│  └─ audit/             # 审计日志模型与查询接口

uploads/                # 本地图片存储目录（自动创建，已加入 .gitignore，静态服务 /uploads 路径）
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

- Email: `admin@local.com`
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

- `status` — String, **必填**, enum: `['unverified','pending','verified','rejected']`, default: `'unverified'` — 商户账户审核状态
- `rejectReason` — String, 可选 — 审核驳回原因

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
- `pendingChanges` — Mixed, 可选, 默认 `null` — 临时存储商户提交但待审批的更新内容
- `pendingDeletion` — Boolean, 可选, 默认 `false` — 删除请求标记
- `deletedAt` — Date, 可选, 默认 `null`
- timestamps: `createdAt`, `updatedAt`

**baseInfo（酒店基础信息）**

- `nameCn` — String, **必填**
- `nameEn` — String, 可选
- `address` — String, **必填**
- `city` — String, **必填**, **带索引 (index)**
- `star` — Number, **必填**, 0~5 之间的整数
- `openTime` — String, **必填**（文本，如 "2020-01-01"）
- `roomTotal` — Number, **必填**, 最小值 0
- `phone` — String, **必填**
- `description` — String, **必填**
- `images` — String[], **必填**
- `facilities` — Array (required, non-empty) of *Facility* objects — **必填且非空**，用于按分类展示酒店设施。*Facility* 对象结构：
  - `category` — String **必填**（例如："公共设施"）
  - `content` — String **必填**，HTML 富文本（分类的整体描述）
  - `summary` — String 可选（短摘要，供列表/搜索使用）
  - `icon` — String 可选（图标标识或路径）
  - `order` — Number 可选，默认 0（用于排序）
  - `visible` — Boolean 可选，默认 true（是否展示）
  - `items` — Array 可选，用于列出分类下的细分设施。每项结构：
    - `name` — String **必填**（设施名称，如"免费WiFi"）
    - `description` — String 可选（设施说明，支持HTML）
    - `icon` — String 可选（设施图标）
    - `available` — Boolean 可选，默认 true（设施是否可用）
  - 说明：`content` 支持 HTML 富文本，系统在存储和显示前应做 XSS 防护处理。
- `policies` — Array (required, non-empty) of *Policy* objects — **必填且非空**，记录酒店整体政策。*Policy* 对象结构：
  - `policyType` — String **必填**（如 `petAllowed` / `cancellation`）
  - `content` — String **必填**，HTML 富文本（策略详情）
  - `summary` — String 可选（简短描述，用于列表显示）
  - `flags` — Record<string, any> 可选，JSON 对象（用于快速筛选/标签，如 `{type:'pet', allowed:true}` ...）
  - `effectiveFrom` — Date 可选（生效日期）
  - 说明：`content` 为 HTML 富文本，建议使用编辑器创建并在后端做 XSS 防护。
- `surroundings` — Array 可选，记录酒店周边重要点。每项结构：
  - `surType` — String, 枚举：`'metro'` | `'attraction'` | `'business'`（地铁 / 景点 / 商圈）
  - `surName` — String **必填**（名称）
  - `distance` — Number **必填**（距离，单位米）
- `discounts` — Array 可选，记录酒店可用促销。每项结构：
  - `title` — String **必填**（促销标题）
  - `type` — String **必填**，枚举：`'discount'` | `'instant'`（折扣 / 立减）
  - `content` — String **必填**（促销描述）

**checkinInfo（入住 / 早餐）**

- `checkinTime` — String, **必填**
- `checkoutTime` — String, **必填**

**checkinInfo（入住 / 早餐）**

- `checkinTime` — String, **必填**（如 "14:00"）
- `checkoutTime` — String, **必填**（如 "11:00"）
- `breakfastType` — String, 可选（早餐类型）
- `breakfastPrice` — Number, 可选（早餐价格）

**auditInfo（审核状态）**

- `status` — String, **必填**, 枚举：`'draft'` | `'pending'` | `'approved'` | `'rejected'` | `'offline'`, 默认 `'draft'`
- `auditedBy` — ObjectId, 可选, ref: `User`, **带索引 (index)**, 默认 `null`
- `auditedAt` — Date, 可选, 默认 `null`
- `rejectReason` — String, 可选（驳回原因）

**商户侧更新说明**

- 商户对 `Hotel` / `Room` 的更新通过 `PUT` 提交后 **不会立即生效**。商户提交的更改会保存到 `pendingChanges` 字段，并把 `auditInfo.status` 设为 `pending`，管理员需通过现有的审批接口（`/api/admin/hotels/:id/approve` 或 `/api/admin/rooms/:id/approve`）审核通过后，系统会把 `pendingChanges` 合并到正式字段并清除 `pendingChanges`；若管理员驳回，`auditInfo.status` 将被置为 `rejected` 并记录 `rejectReason`，商户需重新修改后再次提交审核。
- `breakfastInfo` — 子文档, 可选, 默认 `{}`
- `auditInfo` — 子文档, 可选, 默认 `{}`
- timestamps: `createdAt`, `updatedAt`

**baseInfo（房型基础信息）**

- `type` — String, **必填**（房间类型名称，如"标准间"、"豪华间"）
- `price` — Number, **必填**（每晚价格，最小值 0）
- `images` — String[], **必填**（房间图片URL列表）
- `status` — String, **必填**, enum: `['draft','pending','approved','rejected','offline']`, 默认 `'draft'`
- `maxOccupancy` — Number, **必填**（最多容纳人数，最小值 1）
- `facilities` — Array (required, non-empty) of *Facility* objects — **必填且非空**，房间级别设施展示。结构与 Hotel 中的 *Facility* 相同：包含 `category`、`content`（HTML富文本）、可选 `items` 数组（细项含 `name`/`description`/`icon`/`available`），以及 `summary`/`icon`/`order`/`visible` 等辅助字段。
- `policies` — Array (required, non-empty) of *Policy* objects — **必填且非空**，房间专属政策（支持 HTML），结构与 Hotel 的 *Policy* 相同，常用于 `noSmoking` | `breakfast` 等房间级别策略。
- `bedRemark` — Array of String — **必填且非空**，记录成人加床、床型特殊说明等轻量备注信息（例如：`["成人加床：免费，需提前申请"]`）

**auditInfo（酒店审核）**

- `status` — String, **必填**, enum: `['draft','pending','approved','rejected','offline']`, default: `'draft'`
- `auditedBy` — ObjectId, 可选, ref: `User`, **带索引 (index)**, default: `null`
- `auditedAt` — Date, 可选, default: `null`
- `rejectReason` — String, 可选（驳回原因）

---

### Room — 房型表 (`Room`) 🛏️

**顶级字段**

- `hotelId` — ObjectId, **必填**, ref: `Hotel`, **带索引 (index)**
- `baseInfo` — 子文档, **必填**
- `headInfo` — 子文档, **必填**
- `bedInfo` — 子文档数组, **必填**（至少为空数组 `[]` 不可缺失）
- `breakfastInfo` — 子文档, 可选, 默认 `{}`
- `auditInfo` — 子文档, 可选, 默认 `{}`
- `pendingChanges` — Mixed, 可选, 默认 `null` — 临时存储商户提交但待审批的更新内容
- `pendingDeletion` — Boolean, 可选, 默认 `false` — 删除请求标记
- `deletedAt` — Date, 可选, 默认 `null`
- timestamps: `createdAt`, `updatedAt`

**baseInfo（房型核心信息）**

- `type` — String, **必填**（房间类型名称，如"标准间"、"豪华间"）
- `price` — Number, **必填**, 最小值 0（每晚价格）
- `images` — String[], **必填**（房间图片URL列表）
- `status` — String, **必填**, 枚举：`'draft'` | `'pending'` | `'approved'` | `'rejected'` | `'offline'`, 默认 `'draft'`
- `maxOccupancy` — Number (整数), **必填**, 最小值 1（最多容纳人数）
- `facilities` — Array (required, non-empty) of *Facility* objects — **必填且非空**，房间级别设施展示。结构与 Hotel 中的 *Facility* 相同（含 category、content、items 等字段），常用于展示房间内的浴缸、空调等设施。
- `policies` — Array (required, non-empty) of *Policy* objects — **必填且非空**，房间专属政策。结构与 Hotel 的 *Policy* 相同，常用于 `noSmoking`、`extraBed`、`breakfast` 等房间级别政策。
- `bedRemark` — Array of String — **必填且非空**，房间床铺的轻量备注信息（非结构化文本）。示例：`["成人加床：免费，需提前申请", "儿童可免费入住"]`

**headInfo（房间属性）**

- `size` — String, **必填**（房间面积，如 "25 sqm"）
- `floor` — String, **必填**（楼层）
- `wifi` — Boolean, **必填**（是否有WiFi）
- `windowAvailable` — Boolean, **必填**（是否有窗户）
- `smokingAllowed` — Boolean, **必填**（是否允许吸烟）

**bedInfo（床型数组）**

- 每项：
  - `bedType` — String, **必填**（床类型，如"大床"、"双床")
  - `bedNumber` — Number, **必填**（该床型的数量）
  - `bedSize` — String, **必填**（床尺寸，如 "1.5m x 2m"）

**breakfastInfo（房间早餐）**

- `breakfastType` — String, 可选（早餐类型，如"自助"、"套餐"）
- `cuisine` — String, 可选（餐食风格，如"中式"、"西式"）
- `bussinessTime` — String, 可选（营业时间，如 "06:00-10:00"）
- `addBreakfast` — String, 可选（额外早餐说明）

**auditInfo（房间审核）**

- `status` — String, 可选, 枚举：`'draft'` | `'pending'` | `'approved'` | `'rejected'` | `'offline'`, 默认 `'draft'`
- `auditedBy` — ObjectId, 可选, ref: `User`, **带索引 (index)**, 默认 `null` — 审批者用户ID
- `auditedAt` — Date, 可选, 默认 `null` — 审批时间
- `rejectReason` — String, 可选（驳回原因）

---

### AuditLog — 审计日志表 (`AuditLog`) 🔍

- 维护：仅 `createdAt`（timestamps）
- `targetType` — String, **必填**, 枚举：`'hotel'` | `'merchant'` | `'room'`
- `targetId` — ObjectId, **必填**, **带索引 (index)**, 指向对应资源的主键
- `action` — String, **必填**, 枚举：`'submit'` | `'approve'` | `'reject'` | `'offline'` | `'delete_request'` | `'update_request'`
- `operatorId` — ObjectId, **必填**, ref: `User`, **带索引 (index)**
- `reason` — String, 可选（操作原因，如驳回原因）

---

### Notification — 通知表 (`Notification`) 🔔

用于记录系统通知，支持商户、管理员的双向消息推送。主要场景：
- 商户提交资料/酒店/房间 -> 管理员收到审核待处理通知
- 管理员批准/驳回审核 -> 商户收到审核反馈通知

**顶级字段**

- `userId` — ObjectId, **必填**, ref: `User`, **带索引 (index)** — 通知接收者 ID（admin 或 merchant user）
- `senderType` — String, **必填**, 枚举：`'admin'` | `'system'`, 默认 `'system'` — 发送方类型
- `type` — String, **必填**, 枚举：`'audit_pending'` | `'audit_approved'` | `'audit_rejected'` | `'update_request'` — 通知类型
- `targetType` — String, **必填**, 枚举：`'merchant'` | `'hotel'` | `'room'` — 目标资源类型
- `targetId` — ObjectId, **必填**, **带索引 (index)** — 目标资源 ID（指向 Merchant/Hotel/Room 主键）
- `message` — String, **必填**（通知文案，用于前端展示）
- `meta` — Mixed, 可选, 默认 `{}` — 元数据，JSON 对象。常用字段：
  - `resourceName` — String（资源名称，如酒店名称）
  - `reason` — String（驳回原因，仅 audit_rejected 类型）
  - `operatorId` — ObjectId（操作者用户ID，仅当操作者为管理员时）
  - 其他业务相关字段（如 `roomId`、`hotelId` 等）
- `read` — Boolean, 可选, 默认 `false` — 已读标记
- timestamps: `createdAt`（仅维护创建时间，无 updatedAt）

**通知类型说明**

| 类型 | 触发条件 | 接收者 | 说明 |
|------|--------|------|------|
| `audit_pending` | 商户提交 (submit) | 所有 admin | 商户提交审核时通知管理员审核 |
| `audit_approved` | 管理员批准 (approve) | 对应 merchant | 管理员审核通过后通知商户 |
| `audit_rejected` | 管理员驳回 (reject) | 对应 merchant | 管理员审核驳回时通知商户并附上驳回原因 |
| `update_request` | 商户更新请求 | 所有 admin | 商户对已审批资源的更新申请 |

**索引**

- `{ userId: 1, read: 1, createdAt: -1 }` — 用户查询未读通知排序


### 验证中间件说明

所有需要请求体验证的路由都使用 `validateBody(schema)` 中间件：

```typescript
// 示例
router.post('/hotels', 
  requireAuth,
  requireRole('merchant'),
  validateBody(createHotelSchema), // 自动验证请求体
  hotelController.createHotel
);
```

**验证失败处理：** 当请求体不符合 schema 时，中间件返回 `400 Bad Request`，包含详细的验证错误信息。

---

## �🚀 性能优化与安全特性

### API 请求频率限制

系统实现了基于 Redis 的 API 请求频率限制，防止暴力破解和 API 滥用：

**特性：**
- 双重存储机制：Redis 为主，内存为备，确保高可用性
- 基于 IP 和用户 ID 的双重限制，提供更准确的频率控制
- 多层次的限制规则：
  - 全局 API 限制：每分钟 60 次请求
  - 敏感接口限制：每分钟 10 次请求
  - 登录接口限制：每分钟 5 次请求
  - 注册接口限制：每分钟 3 次请求
- 详细的响应头信息：`X-RateLimit-Limit`、`X-RateLimit-Remaining`、`X-RateLimit-Reset`

### Redis 缓存机制

使用 Redis 缓存热点数据，显著提升查询性能和响应速度：

**特性：**
- 查询结果缓存：减少数据库访问，提升响应速度
- 热点数据缓存：热门酒店、城市列表等数据缓存
- 智能缓存策略：根据数据类型设置不同的过期时间
  - 酒店列表缓存：5 分钟
  - 热门酒店缓存：1 小时
  - 城市列表缓存：24 小时
- 缓存过期策略：数据变更时自动清除相关缓存，确保数据一致性
- 高可用性：Redis 不可用时自动切换到内存存储

### 图片处理优化

实现了图片自动压缩和尺寸调整，减少存储空间和传输时间：

**特性：**
- 自动压缩：上传图片时自动压缩，最大宽度 1920px，质量 80%
- 多格式支持：支持 JPEG、PNG、GIF、WebP 等格式
- 异步处理：图片压缩不阻塞上传响应，提升用户体验
- 批量处理：支持多图片上传的批量压缩

**实现文件：**
- `src/services/image.service.ts` - 图片处理服务
- `src/middlewares/upload.middleware.ts` - 上传中间件（已集成压缩功能）

### 数据库索引优化

为常用查询添加了复合索引和全文搜索索引，显著提升查询性能：

**酒店模型索引：**
- 单字段索引：`city`、`star`、`merchantId`
- 复合索引：
  - `{ merchantId: 1, createdAt: -1 }` - 商户酒店列表查询
  - `{ 'auditInfo.status': 1, createdAt: -1 }` - 按状态和时间排序
  - `{ 'baseInfo.city': 1, 'baseInfo.star': -1 }` - 城市和星级筛选
  - `{ 'auditInfo.status': 1, 'baseInfo.city': 1 }` - 状态和城市筛选
- 全文搜索索引：
  - 字段：`baseInfo.nameCn`、`baseInfo.nameEn`、`baseInfo.description`
  - 权重：名称权重高于描述
  - 语言：中文

**房型模型索引：**
- 单字段索引：`hotelId`、`auditedBy`、`baseInfo.price`
- 复合索引：
  - `{ hotelId: 1, createdAt: -1 }` - 酒店房型列表查询
  - `{ 'auditInfo.status': 1, createdAt: -1 }` - 按状态和时间排序
  - `{ 'auditInfo.status': 1, hotelId: 1 }` - 状态和酒店筛选

**搜索优化：**
- 使用 MongoDB 的 `$text` 操作符替代正则表达式，提升搜索性能
- 支持按相关性排序，搜索结果更准确

### XSS 防护

使用 DOMPurify 净化 HTML 富文本内容，防止 XSS 攻击：

**特性：**
- 自动净化：在存储和显示 HTML 富文本内容时自动净化
- 安全标签：只允许安全的 HTML 标签和属性
- 测试环境适配：测试环境中使用简化实现，避免 ESM 模块问题

---
