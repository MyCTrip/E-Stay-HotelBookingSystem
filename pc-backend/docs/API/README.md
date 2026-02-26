# API 文档（pc-admin-backend）

此文档为后端管理系统（PC 管理后台）的接口参考，覆盖认证、商户、酒店、房型、管理员操作与通知管理。每个接口包含：功能说明、URL/HTTP 方法、权限、请求参数（Path/Query/Body）、示例请求与示例成功/错误响应。

通用说明：

- 鉴权：受保护接口需在请求头包含 `Authorization: Bearer <token>`。
- 所有写接口在请求体做严格校验（Zod），校验失败会返回 400，并包含字段错误信息。
- 错误响应格式：
  ```json
  { "status": "error", "message": "错误描述", "errors": {"field":"msg"} }
  ```

---

## Auth（公开） 🔓

### POST /api/auth/register

- 功能：注册新用户（仅创建账号，不创建商户资料）。
- 权限：公开
- 请求体 (application/json)：
  - `email` (string, required, email)
  - `password` (string, required, min 6)
- 成功响应：201
  ```json
  { "id": "<userId>", "email": "user@example.com" }
  ```
- 错误示例：400（校验失败）
  ```json
  { "status":"error","message":"Validation failed","errors":{"email":"Invalid email"} }
  ```
- 示例（curl）：
  ```bash
  curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"email":"m1@test.com","password":"password1"}'
  ```

### POST /api/auth/login

- 功能：用户登录，返回 JWT token
- 权限：公开
- 请求体：
  - `email` (string, required)
  - `password` (string, required)
- 成功响应：200
  ```json
  { "token": "<jwt_token>" }
  ```
- 错误示例：401（认证失败）
  ```json
  { "status":"error","message":"Invalid credentials" }
  ```

### GET /api/auth/me

- 功能：获取当前登录用户基础信息
- 权限：需要 `Authorization`
- 成功响应：200
  ```json
  { "id": "<userId>", "email": "user@example.com", "role": "merchant" }
  ```

---

### POST /api/upload

- 功能：上传单张图片，返回图片 URL
- 权限：需要 `Authorization`（登录用户均可）
- 请求类型：`multipart/form-data`，字段名 `file`
- 请求体：
  - `file` (required) 图片文件（jpg/png/gif/webp）
- 成功响应：200
  ```json
  { "url": "/uploads/1707123456789-abcdef12.jpg", "filename": "1707123456789-abcdef12.jpg", "size": 123456 }
  ```
- 错误示例：
  - 415（类型不支持）
    ```json
    { "message": "仅支持图片类型 (jpg/png/gif/webp)" }
    ```
  - 413（文件过大）
    ```json
    { "message": "图片大小不能超过 5MB" }
    ```
  - 400（未收到文件）
    ```json
    { "message": "未收到文件" }
    ```
- 示例（curl）：
  ```bash
  curl -X POST http://localhost:3000/api/upload \
    -H "Authorization: Bearer <token>" \
    -F "file=@/path/to/image.jpg"
  ```

---

## Merchant（商户） 🏬

说明：商户用户在平台上维护自己的 `MerchantProfile`（baseInfo、qualificationInfo、auditInfo）。

### GET /api/merchants

- 功能：获取当前登录用户的商户资料（若无则返回 404 或空）
- 权限：`Authorization` (merchant)
- 成功响应：200
  ```json
  { "userId":"<id>", "baseInfo": {...}, "qualificationInfo": {...}, "auditInfo": {...} }
  ```

### POST /api/merchants

- 功能：创建或更新（upsert）商户资料
- 权限：`Authorization` (merchant)
- 请求体：
  - `baseInfo` (object, required) 包含 `merchantName`, `contactName`, `contactPhone`, `contactEmail` 等
  - `qualificationInfo` (object, optional) 包含 `businessLicenseNo`, `businessLicensePhoto`, `idCardNo` 等
- 校验失败示例：400
- 成功响应：200
  ```json
  { "id": "<merchantId>", "baseInfo": {...} }
  ```

### PUT /api/merchants

- 功能：更新商户资料（同 POST，用于表示更新操作）
- 权限：`Authorization` (merchant)
- 请求体：
  - `baseInfo` (object, optional) 包含需要更新的字段
  - `qualificationInfo` (object, optional) 包含需要更新的字段，如 `businessLicenseNo`, `businessLicensePhoto`, `idCardNo` 等
- 校验失败示例：400
- 成功响应：200
  ```json
  { "id": "<merchantId>", "baseInfo": {...}, "qualificationInfo": {...} }
  ```

### POST /api/merchants/submit

- 功能：将商户资料提交审核（auditInfo.verifyStatus -> 'pending'），并写入 AuditLog(action='submit')
- 权限：`Authorization` (merchant)
- 请求体：{}
- 成功响应：200 `{ "status": "submitted" }`

---

## Hotel（商户侧） 🏨

说明：酒店（Hotel）由商户创建并提交给管理员审批。支持三种房型：**hotel（标准酒店）**、**hourlyHotel（钟点房）**、**homeStay（民宿）**。

### POST /api/hotels

- 功能：创建酒店
- 权限：`Authorization` (merchant)，且商户必须为酒店 owner 且通过实名/资质验证
- 请求体：
  - `baseInfo` (required):
    - 常见字段：`nameCn`(string), `address`(string), `city`(string), `star`(number), `phone`(string), `description`(string), `images`(string[])
    - **新增：`propertyType`** (string, optional) — 房型类型：`'hotel'` | `'hourlyHotel'` | `'homeStay'`, 默认 `'hotel'`
    - 新增：`location` (object, optional) — GeoJSON Point，用于地理位置查询 `{ type: 'Point', coordinates: [lng, lat] }`
    - 新增：`facilities` (Array<Object>, required, non-empty) — 设施分类结构
      - 每项：{ `id`: string (required), `name`: string (required), `facilities`: Array<{`id`: string, `name`: string, `available`: boolean}> (required) }
    - 新增：`policies` (Array<Object>, required, non-empty)
      - 每项：{ `policyType`: string (required), `content`: string (required, HTML) }
    - 新增（可选）：`surroundings` (Array<Object>)
      - 每项: { `surType`: 'metro'|'attraction'|'business', `surName`: string, `distance`: number }
    - 新增（可选）：`discounts` (Array<Object>)
      - 每项: { `title`: string, `type`: 'discount'|'instant', `content`: string }
  - **`typeConfig`** (object, optional) — 房型特定配置（根据 propertyType 自动初始化）
    - 若 `propertyType='hourlyHotel'`，包含：
      ```json
      {
        "hourly": {
          "baseConfig": {"pricePerHour": 88, "minimumHours": 2, "cleaningTime": 45, "maxBookingsPerDay": 4},
          "timeSlots": [{"dayOfWeek": 0, "startTime": "08:00", "endTime": "22:00", "minStayHours": 2}]
        }
      }
      ```
    - 若 `propertyType='homeStay'`，包含：
      ```json
      {
        "homestay": {"hostName": "...", "hostPhone": "...", "responseTimeHours": 2, "instantBooking": true, "minStay": 1, "securityDeposit": 100}
      }
      ```
  - `checkinInfo` (optional): `{ checkinTime, checkoutTime }`
- 示例请求体（标准酒店）：
  ```json
  {
    "baseInfo": {
      "nameCn":"示例酒店",
      "address":"示例地址",
      "city":"Beijing",
      "star":4,
      "phone":"010-12345678",
      "description":"说明",
      "images":[],
      "propertyType":"hotel",
      "facilities":[
        {
          "id":"service",
          "name":"服务",
          "facilities":[
            {"id":"wifi","name":"WiFi","available":true},
            {"id":"parking","name":"停车场","available":true}
          ]
        }
      ],
      "policies":[{"policyType":"petAllowed","content":"<p>No pets</p>"}],
      "surroundings":[{"surType":"metro","surName":"地铁1号线","distance":500}],
      "discounts":[{"title":"首单立减","type":"instant","content":"首单减10元"}]
    }
  }
  ```
- 示例请求体（钟点房 hourlyHotel）：
  ```json
  {
    "baseInfo": {
      "nameCn":"示例钟点房酒店",
      "address":"示例地址",
      "city":"Shanghai",
      "star":4,
      "phone":"021-87654321",
      "description":"短租特色酒店",
      "images":[],
      "propertyType":"hourlyHotel"
    },
    "typeConfig": {
      "hourly": {
        "baseConfig": {"pricePerHour": 88, "minimumHours": 2, "cleaningTime": 45, "maxBookingsPerDay": 4},
        "timeSlots": [
          {"dayOfWeek": 0, "startTime": "08:00", "endTime": "22:00", "minStayHours": 2, "maxBookingsPerSlot": 5}
        ]
      }
    }
  }
  ```
- 示例请求体（民宿 homeStay）：
  ```json
  {
    "baseInfo": {
      "nameCn":"示例民宿",
      "address":"示例地址",
      "city":"Hangzhou",
      "star":4,
      "phone":"0571-12345678",
      "description":"温馨民宿",
      "images":[],
      "propertyType":"homeStay"
    },
    "typeConfig": {
      "homestay": {
        "hostName":"小王",
        "hostPhone":"13800138000",
        "responseTimeHours": 2,
        "instantBooking": true,
        "minStay": 1,
        "maxStay": 30,
        "securityDeposit": 100,
        "amenityTags": ["厨房", "WiFi", "拖鞋"]
      }
    }
  }
  ```
- 成功响应：201
  ```json
  { "id": "<hotelId>", "baseInfo": {...} }
  ```
- 常见错误：400（校验失败，若 `facilities`/`policies` 为空则会报错）

### GET /api/hotels

- 功能：列出公开已批准的酒店（用于前端展示）
- 权限：公开
- Query 参数（可选）：`city`, `search`, `limit`, `page`, **`propertyType`** (可按房型过滤：`hotel` | `hourlyHotel` | `homeStay`)
- 缓存说明：该接口使用 Redis 缓存，缓存时间为 5 分钟（300 秒）。当酒店数据变更时，相关缓存会自动清除。
- 成功响应：200 `{ data: Hotel[], meta: { total, page, limit } }`

### GET /api/hotels/hot

- 功能：获取热门酒店列表
- 权限：公开
- Query 参数（可选）：
  - `limit` (number, 默认 10, 最大 50) - 返回的热门酒店数量(最近审核通过的n个酒店，后续采集用户行为后可调整)
- 缓存说明：该接口使用 Redis 缓存，缓存时间为 1 小时（3600 秒）。热门酒店按创建时间倒序排序，仅包含已审核通过的酒店。
- 成功响应：200
  ```json
  [
    {
      "_id": "<hotelId>",
      "baseInfo": {
        "nameCn": "酒店名称",
        "city": "城市",
        "star": 4,
        "images": ["图片URL"],
        "description": "描述"
      }
    }
  ]
  ```
- 示例（curl）：
  ```bash
  curl http://localhost:3000/api/hotels/hot?limit=10
  ```

### GET /api/hotels/cities

- 功能：获取所有有酒店的城市列表
- 权限：公开
- 缓存说明：该接口使用 Redis 缓存，缓存时间为 24 小时（86400 秒）。仅返回有已审核通过酒店的城市名称。
- 成功响应：200
  ```json
  ["北京", "上海", "广州", "深圳"]
  ```
- 示例（curl）：
  ```bash
  curl http://localhost:3000/api/hotels/cities
  ```

### GET /api/hotels/my

- 功能：获取当前商户创建/拥有的酒店列表
- 权限：`Authorization` (merchant)
- Query：支持 `status`, `search`, `limit`, `page`
- 成功响应：200 `{ data: Hotel[], meta: {...} }`

### PUT /api/hotels/:id

- 功能：更新酒店（部分字段可变）。**注意：商户提交更新将不会立即生效，会被保存为待审核变更（`pendingChanges`）并把 `auditInfo.status` 设为 `pending`，需要管理员批准后才会应用到正式数据。**
- 权限：`Authorization`，仅 owner 或 admin
- Path：`:id` (hotelId)
- 请求体：同 POST（部分字段可选，如 `baseInfo` / `checkinInfo`）
- 行为：
  - 若发起人为商户（owner）：更新被保存到 `pendingChanges`，`auditInfo.status='pending'`，并写入 `AuditLog(action='update_request')`；管理员批准后，`pendingChanges` 会被合并到正式字段并清除。
  - 若发起人为管理员（admin）：变更立即生效（直接合并到 `baseInfo` / `checkinInfo`），并清除任何 `pendingChanges`。
- 成功响应：200 `{ id: <id>, baseInfo: {...}, pendingChanges?: {...}, auditInfo: {...} }`

### POST /api/hotels/:id/submit

- 功能：商户提交酒店审核（设置 `auditInfo.status='pending'`），记录 AuditLog
- 权限：`Authorization` (merchant)
- 成功响应：200 `{ "status":"submitted" }`

### GET /api/hotels/:id/rooms

- 功能：获取酒店下房型列表（owner/admin 可见全部，公开列表仅返回 approved）
- 权限：`Authorization`（owner/admin 对私有视图）或公开（已审批的房型）
- Query：`status`, `search`, `limit`, `page`
- 成功响应：200 `{ data: Room[], meta: {...} }`

# GET /api/hotels/:id

功能：获取酒店详情（公开接口，返回已审核通过的酒店完整信息）

权限：公开
（若为 owner 或 admin 访问，可返回包含 pendingChanges 在内的完整数据；普通用户仅能访问已审核通过酒店）

Path 参数：

* `:id` (string, required) — 酒店 ID

行为说明：

* 若酒店 `auditInfo.status !== 'approved'`

  * 普通用户访问 → 返回 404（避免暴露未审核数据）
  * owner / admin 访问 → 返回完整数据（包含 pendingChanges）
* 若酒店存在 `pendingChanges`

  * owner / admin 可看到 `pendingChanges`
  * 普通用户仅看到已生效数据

缓存说明：

* 该接口使用 Redis 缓存（keyPrefix: `hotel:`）
* 缓存时间为 5 分钟（300 秒）
* 当酒店审核通过或更新时，相关缓存会自动清除

成功响应：200

```json
{
  "_id": "<hotelId>",
  "baseInfo": {
    "nameCn": "酒店名称",
    "address": "地址",
    "city": "城市",
    "star": 4,
    "phone": "联系电话",
    "description": "描述",
    "images": [],
    "propertyType": "hotel",
    "facilities": [
      { "category": "公共", "content": "<p>WiFi</p>" }
    ],
    "policies": [
      { "policyType": "petAllowed", "content": "<p>No pets</p>" }
    ],
    "surroundings": [
      { "surType": "metro", "surName": "地铁1号线", "distance": 500 }
    ],
    "discounts": [
      { "title": "首单立减", "type": "instant", "content": "首单减10元" }
    ]
  },
  "typeConfig": {
    "hourly": {},
    "homestay": {}
  },
  "checkinInfo": {
    "checkinTime": "14:00",
    "checkoutTime": "12:00"
  },
  "auditInfo": {
    "status": "approved",
    "rejectReason": null,
    "submittedAt": "2026-01-01T10:00:00.000Z",
    "approvedAt": "2026-01-02T10:00:00.000Z"
  },
  "createdAt": "2026-01-01T09:00:00.000Z",
  "updatedAt": "2026-01-02T10:00:00.000Z"
}
```

常见错误：

* 400：非法 ID
* 401：需要登录（若访问私有数据）
* 403：无权限访问该酒店
* 404：酒店不存在或未审核通过

示例（curl）：

```bash
curl http://localhost:3000/api/hotels/65f3a1b2c4d5e6f7g8h9i0j1
```

---

## Room（房型） 🛏️

说明：房型自动继承所在酒店的 `propertyType`，并自动映射为相应的 `category`（`standard` | `hourly` | `homestay`）。每个房型可配置类型特定的 `typeConfig`（如时间段配置、定价、规则等）。

### POST /api/hotels/:hotelId/rooms

- 功能：在指定酒店下创建房型
- 权限：`Authorization` (merchant)，酒店必须为通过审核状态
- Path：`:hotelId` (required)
- 请求体：
  - `baseInfo` (required): `type`, `price`, `images`, `status`, `maxOccupancy`, **`facilities`(non-empty)**, **`policies`(non-empty)**, **`bedRemark`(non-empty)**
    - **`facilities`** (Array<Object>, required, non-empty) — 继承酒店的设施分类结构，结构同酒店 facilities
    - **新增：`category`** (string, auto-derived) — 自动根据所属酒店的 `propertyType` 派生：`'standard'` | `'hourly'` | `'homestay'`（无需手动指定）
  - `headInfo` (required): `size`, `floor`, `wifi`, `windowAvailable`, `smokingAllowed`
  - `bedInfo` (required array): 每项 `{ bedType, bedNumber, bedSize }`
  - **`typeConfig`** (object, optional) — 房型级别的类型特定配置（根据 category 自动初始化）
    - 若 category=`'standard'`：`{"standard": {"cancellationDeadlineHours": 24, "extensionAllowed": true}}`
    - 若 category=`'hourly'`：`{"hourly": {"pricePerHour": ..., "minimumHours": 2, "availableTimeSlots": [...], "cleaningTime": 45, "hourlyTiers": [...]}}`
    - 若 category=`'homestay'`：`{"homestay": {"pricePerNight": ..., "weeklyDiscount": 5, "monthlyDiscount": 10, "cleaningFee": 50, "minimumStay": 1, "maxGuests": 4, "instantly": true}}`
- 示例请求体：见上文
- 成功响应：201 `{ id: <roomId>, baseInfo: {...} }`

### PUT /api/rooms/:id

- 功能：更新房型（部分字段）。**注意：商户提交更新将不会立即生效，会被保存为待审核变更（`pendingChanges`）并把 `auditInfo.status` 设为 `pending`，需要管理员批准后才会应用到正式数据。**
- 权限：`Authorization`（仅 owner 或 admin）
- Path：`:id` (roomId)
- 请求体：允许更新 `baseInfo`、`headInfo`、`bedInfo` 等
- 行为：
  - 若发起人为商户（owner）：更新被保存到 `pendingChanges`，`auditInfo.status='pending'`，并写入 `AuditLog(action='update_request')`；管理员批准后，`pendingChanges` 会被合并到正式字段并清除。
  - 若发起人为管理员（admin）：变更立即生效（直接合并到字段），并清除任何 `pendingChanges`。
- 成功响应：200 `{ id: <id>, baseInfo: {...}, pendingChanges?: {...}, auditInfo: {...} }`

### POST /api/rooms/:id/submit

- 功能：提交房型审核（auditInfo.status='pending'）并写 AuditLog
- 权限：`Authorization`（merchant）
- 成功响应：200 `{ "status":"submitted" }`

---

## 管理端（Admin） 🔧

说明：管理员对商户/酒店/房型具有审批与下线权限，并可以批量操作与查询审计日志。

### 单体审批接口（例）

- POST `/api/admin/hotels/:id/approve` — 批准酒店（若存在 `pendingChanges`，会在批准时将其合并到 `Hotel` 正式字段并清除 `pendingChanges`）
- POST `/api/admin/hotels/:id/reject` — 驳回酒店 `{ reason?: string }`（若驳回，`auditInfo.status` 会被置为 `rejected`，`rejectReason` 中保存原因）
- POST `/api/admin/rooms/:id/approve` — 批准房型（若存在 `pendingChanges`，会在批准时将其合并到 `Room` 正式字段并清除 `pendingChanges`）
- POST `/api/admin/rooms/:id/reject` — 驳回房型 `{ reason?: string }`
- POST `/api/admin/hotels/:id/offline` — 下线酒店 `{ reason?: string }`

- POST `/api/admin/rooms/:id/approve|reject|offline` — 操作房型
- POST `/api/admin/merchants/:id/approve|reject` — 操作商户

- 权限：`Authorization` (admin)
- 成功响应：200 `{ updated: <id>, action: 'approve' }` 或 400/404（找不到/参数错误）

### 批量审批

- POST `/api/admin/hotels/bulk` / `/api/admin/rooms/bulk` / `/api/admin/merchants/bulk`
- 请求体：
  ```json
  { "ids": ["id1","id2"], "action": "approve|reject|offline", "reason": "optional" }
  ```
- 返回：200
  ```json
  { "updated": ["id1"], "errors": [{"id":"id2","error":"not_found"}] }
  ```

### 管理端列表查询

- GET `/api/admin/hotels` — 支持 `status`, `merchantId`, `search`, `limit`, `page` 返回 `{ data, meta }`
- GET `/api/admin/rooms` — 支持 `status`, `hotelId`, `search`, `limit`, `page`
- GET `/api/admin/merchants` — 支持 `status`, `search`, `limit`, `page`

### 审计日志查询

- GET `/api/admin/audit-logs` 支持 `targetType`, `action`, `operatorId`, `startDate`, `endDate`, `limit`, `page`
- 返回：`{ data: AuditLog[], meta: { total, page, limit } }`（按 `createdAt` 倒序）

### 通知管理（管理员端） 🔔

**说明：** 管理员接收来自商户提交（审核待处理）的通知，以及可以查看、标记已读通知。

#### GET /api/admin/notifications

- 功能：获取当前管理员的通知列表
- 权限：`Authorization` (admin)
- Query 参数（可选）：
  - `type` (string) - 通知类型筛选：`audit_pending` | `audit_approved` | `audit_rejected` | `update_request`
  - `read` (string) - 已读状态筛选：`true` | `false`
  - `limit` (number, 默认 20, 最大 100) - 每页数量
  - `page` (number, 默认 1) - 页码
- 成功响应：200
  ```json
  {
    "data": [
      {
        "_id": "<notificationId>",
        "userId": "<adminUserId>",
        "senderType": "system",
        "type": "audit_pending",
        "targetType": "hotel",
        "targetId": "<hotelId>",
        "message": "酒店「示例酒店」已提交审核，请及时处理",
        "meta": {
          "resourceName": "示例酒店",
          "hotelId": "<hotelId>"
        },
        "read": false,
        "createdAt": "2026-02-12T10:00:00Z"
      }
    ],
    "meta": {
      "total": 15,
      "page": 1,
      "limit": 20,
      "unreadCount": 5
    }
  }
  ```

#### PATCH /api/admin/notifications/:id/read

- 功能：标记指定通知为已读
- 权限：`Authorization` (admin)
- Path：`:id` (notificationId)
- 请求体：{}
- 成功响应：200
  ```json
  {
    "_id": "<notificationId>",
    "read": true,
    "updatedAt": "2026-02-12T10:05:00Z"
  }
  ```

#### PATCH /api/admin/notifications/read-all

- 功能：标记管理员的所有通知为已读
- 权限：`Authorization` (admin)
- 请求体：{}
- 成功响应：200
  ```json
  { "message": "所有通知已标记为已读", "updatedCount": 5 }
  ```

---

## 通知管理（商户端） 📬

**说明：** 商户可以查看来自管理员的审核反馈通知（批准或驳回），以及标记已读。

#### GET /api/merchants/notifications

- 功能：获取当前商户的通知列表
- 权限：`Authorization` (merchant)
- Query 参数（可选）：
  - `type` (string) - 通知类型筛选：`audit_pending` | `audit_approved` | `audit_rejected` | `update_request`
  - `read` (string) - 已读状态筛选：`true` | `false`
  - `limit` (number, 默认 20, 最大 100) - 每页数量
  - `page` (number, 默认 1) - 页码
- 成功响应：200
  ```json
  {
    "data": [
      {
        "_id": "<notificationId>",
        "userId": "<merchantUserId>",
        "senderType": "admin",
        "type": "audit_approved",
        "targetType": "hotel",
        "targetId": "<hotelId>",
        "message": "您的酒店「示例酒店」已通过审核，已发布在线",
        "meta": {
          "resourceName": "示例酒店",
          "operatorId": "<adminId>"
        },
        "read": false,
        "createdAt": "2026-02-12T10:00:00Z"
      }
    ],
    "meta": {
      "total": 8,
      "page": 1,
      "limit": 20,
      "unreadCount": 2
    }
  }
  ```

#### PATCH /api/merchants/notifications/:id/read

- 功能：标记指定通知为已读
- 权限：`Authorization` (merchant)
- Path：`:id` (notificationId)
- 请求体：{}
- 成功响应：200
  ```json
  {
    "_id": "<notificationId>",
    "read": true,
    "updatedAt": "2026-02-12T10:05:00Z"
  }
  ```

---


## 测试说明 🧪

- 自动化：`pnpm test`（Jest + ts-jest + supertest + mongodb-memory-server）。测试在内存 Mongo 实例运行，确保 CI 可重复。
- 手动 smoke：`pnpm run test:api`（`scripts/test-api.js`），可配置环境变量以在真实 Mongo 上测试（建议先使用测试库或备份）。

---
