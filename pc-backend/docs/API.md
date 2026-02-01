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
- 创建酒店（商户必须为 owner）
- 请求：{ baseInfo: {...}, checkinInfo: {...} }

### PUT /api/hotels/:id
- 更新酒店（owner 或 admin）

### POST /api/hotels/:id/submit
- 商户提交酒店审核（auditInfo.status='pending'），写 AuditLog(action='submit')

---

## Room（房型）

### POST /api/hotels/:hotelId/rooms
- 在酒店下创建房型（仅 owner）

### PUT /api/rooms/:id
- 更新房型（owner 或 admin）

### POST /api/rooms/:id/submit
- 提交房型审核（auditInfo.status='pending'）并写 AuditLog(action='submit')

---

## 管理端（Admin）

### 单体审批
- POST /api/admin/merchants/:id/approve
- POST /api/admin/merchants/:id/reject
- POST /api/admin/hotels/:id/approve
- POST /api/admin/hotels/:id/reject
- POST /api/admin/hotels/:id/offline
- POST /api/admin/rooms/:id/approve
- POST /api/admin/rooms/:id/reject

请求体常见字段：{ reason?: string }

### 批量审批
- POST /api/admin/merchants/bulk
- POST /api/admin/hotels/bulk
- POST /api/admin/rooms/bulk

请求体：{ ids: string[], action: 'approve'|'reject'|'offline' (仅 hotels/rooms 支持 'offline'), reason?: string }
返回：{ updated: [...], errors: [...] }

### 审计日志查询
- GET /api/admin/audit-logs
- 支持筛选（例如通过 query 参数 targetType, action, operatorId, limit, page 等）

---

## 测试说明

- 自动化：`pnpm test`（Jest + ts-jest + supertest + mongodb-memory-server）。测试会在内存 Mongo 实例上运行并在每个测试前清空 collections，测试完成后关闭实例。
- 手动 smoke：`pnpm run test:api`（`scripts/test-api.js`）针对真实 Mongo（默认不清理数据，便于调试），可通过环境变量添加自动清理选项（建议实现 KEEP_DB 控制）。

---
