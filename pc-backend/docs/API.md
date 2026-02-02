# API 文档（pc-admin-backend）

此文档列出当前已实现的后端接口、使用方法与示例请求（简洁版）。如需完整示例（Curl / Postman / OpenAPI），可进一步生成。

通用说明：

- 鉴权：需要登录的接口需在请求头中包含 `Authorization: Bearer <token>`。
- 所有写接口在请求体有参数校验（Zod），校验失败会返回 400 并带有错误信息。

---

## Auth（公开）

### POST /api/auth/register

- 请求体：{ email: string, password: string }
- 校验：email, password (min 6)
- 返回：201 { id, email }

示例（curl）：

```bash
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"email":"m1@test.com","password":"password1"}'
```

### POST /api/auth/login

- 请求体：{ email, password }
- 返回：200 { token }

示例：

```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"m1@test.com","password":"password1"}'
```

### GET /api/auth/me

- 需要：Authorization
- 返回：{ id, email, role }

---

## Merchant（需 merchant 登录）

### GET /api/merchants

- 获取当前用户的商户资料

### POST /api/merchants

- 创建或更新商户资料（upsert）
- 请求：{ baseInfo: { merchantName, contactName, contactPhone, contactEmail }, qualificationInfo?: {...} }

### PUT /api/merchants

- 同 POST，用于更新

### POST /api/merchants/submit

- 提交到审核（auditInfo.verifyStatus -> 'pending'），写 AuditLog(action='submit')

示例（创建资料）：

```bash
curl -X POST http://localhost:3000/api/merchants -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"baseInfo": {"merchantName": "M","contactName":"Alice","contactPhone":"123","contactEmail":"a@test.com"}}'
```

---

## Hotel（商户侧）

### POST /api/hotels

- 创建酒店（商户必须为 owner，且商户资料需已通过验证）
- 请求：{ baseInfo: {...}, checkinInfo: {...} }
- 权限：`Authorization`（merchant） + `requireMerchantVerified`

### GET /api/hotels

- 列出对外已通过审核的酒店（公开，可用于商户/用户前端展示）
- 当前实现：返回所有 `auditInfo.status==='approved'` 的酒店（无分页）
- 建议：如需分页/筛选可在未来扩展（city/search/limit/page）

### GET /api/hotels/my

- 获取当前登录商户创建的酒店列表（需 `Authorization`, 商户必须已通过审核）
- 支持 query：`status`, `search`, `limit`, `page`
- 返回：`{ data: Hotel[], meta: { total, page, limit } }`
- 权限：`Authorization`（merchant） + `requireMerchantVerified`

### PUT /api/hotels/:id

- 更新酒店（仅 owner 或 admin）
- 权限：`Authorization`（owner/admin）

### POST /api/hotels/:id/submit

- 商户提交酒店审核（auditInfo.status='pending'），写 AuditLog(action='submit')
- 权限：`Authorization`（merchant） + `requireMerchantVerified`

### GET /api/hotels/:id/rooms

- 获取某酒店下的房型列表（仅 owner 商户可访问）
- 支持 query：`status`, `search`, `limit`, `page`
- 返回：`{ data: Room[], meta: { total, page, limit } }`
- 权限：`Authorization`（merchant） + 商户为该酒店 owner 或 admin

---

## Room（房型）

### POST /api/hotels/:hotelId/rooms

- 在酒店下创建房型（仅 owner，且酒店必须已通过管理员审核）

### PUT /api/rooms/:id

- 更新房型（仅 owner）。注意：`admin` 不应直接作为 owner 修改房型，管理员可通过审核接口（approve/reject/offline）进行管理。

### POST /api/rooms/:id/submit

- 提交房型审核（auditInfo.status='pending'）并写 AuditLog(action='submit')

---

## 管理端（Admin）

### 单体审批

- POST /api/admin/merchants/:id/approve  — 管理员批准商户
- POST /api/admin/merchants/:id/reject   — 管理员驳回商户（可传 `reason`）
- POST /api/admin/hotels/:id/approve     — 管理员批准酒店
- POST /api/admin/hotels/:id/reject      — 管理员驳回酒店（可传 `reason`）
- POST /api/admin/hotels/:id/offline     — 管理员将酒店下线（可传 `reason`）
- POST /api/admin/rooms/:id/approve      — 管理员批准房型
- POST /api/admin/rooms/:id/reject       — 管理员驳回房型（可传 `reason`）
- POST /api/admin/rooms/:id/offline      — 管理员将房型下线（可传 `reason`）

请求体常见字段：`{ reason?: string }`

### GET /api/admin/me

- 需要：Authorization（admin）
- 返回：200 `{ _id, userId, baseInfo: { name, employeeNo }, createdAt }`；若未建立资料返回 404

### 批量审批

- POST /api/admin/merchants/bulk
- POST /api/admin/hotels/bulk
- POST /api/admin/rooms/bulk

请求体：`{ ids: string[], action: 'approve'|'reject'|'offline' , reason?: string }`

说明：
- `merchants` 支持 `approve|reject`。
- `hotels` 与 `rooms` 支持 `approve|reject|offline`（`offline` 表示管理员将目标置为下线状态，不再对外展示/出售）。

返回：`{ updated: [...], errors: [...] }`

### 管理端列表查询（新）

- GET /api/admin/merchants
  - 支持 query：`status`, `search`, `limit`, `page`
  - 返回：`{ data: Merchant[], meta: { total, page, limit } }`
- GET /api/admin/hotels
  - 支持 query：`status`, `merchantId`, `search`, `limit`, `page`
  - 返回：`{ data: Hotel[], meta: { total, page, limit } }`
- GET /api/admin/rooms
  - 支持 query：`status`, `hotelId`, `search`, `limit`, `page`
  - 返回：`{ data: Room[], meta: { total, page, limit } }`

### 审计日志查询

- GET /api/admin/audit-logs
- 支持筛选与分页，支持的 query 参数包括：`targetType` (hotel|merchant|room)、`action` (submit|approve|reject|offline|...)、`operatorId`、`startDate`、`endDate`、`limit`、`page`。
- 返回格式：`{ data: AuditLog[], meta: { total, page, limit } }`（按 `createdAt` 倒序，默认 `limit=100`，最大 `limit=500`）。

---

## 测试说明

- 自动化：`pnpm test`（Jest + ts-jest + supertest + mongodb-memory-server）。测试会在内存 Mongo 实例上运行并在每个测试前清空 collections，测试完成后关闭实例。
- 手动 smoke：`pnpm run test:api`（`scripts/test-api.js`）针对真实 Mongo（默认不清理数据，便于调试），可通过环境变量添加自动清理选项（建议实现 KEEP_DB 控制）。

---
