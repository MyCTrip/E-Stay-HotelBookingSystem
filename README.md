# PC Admin Backend (First Phase)

## Overview

This repository contains the backend implementation for the PC admin platform of the E-Stay Hotel Booking System. It focuses on platform governance: account system, merchant management, hotel information management and audit flows.

## Tech Stack

- Node.js >= 18
- TypeScript
- Express
- MongoDB + Mongoose
- JWT for auth
- Zod for validation (planned)

## Project Structure

src
|-- app.ts
|-- server.ts
|-- config
|   |-- db.ts
|   |-- env.ts
|   |-- jwt.ts
|-- modules
|   |-- auth
|   |   |-- auth.routes.ts
|   |   |-- auth.controller.ts
|   |   |-- auth.service.ts
|   |   |-- auth.schema.ts
|   |-- user
|   |   |-- user.model.ts
|   |-- merchant
|   |   |-- merchant.model.ts
|   |   |-- merchant.service.ts
|   |   |-- merchant.routes.ts
|   |-- hotel
|   |   |-- hotel.model.ts
|   |   |-- hotel.service.ts
|   |   |-- hotel.routes.ts
|   |-- admin
|   |   |-- admin.routes.ts
|   |   |-- admin.service.ts
|   |-- audit
|       |-- audit.model.ts
|-- middlewares
|   |-- auth.middleware.ts
|   |-- role.middleware.ts
|   |-- error.middleware.ts
|-- utils
|   |-- logger.ts
|-- constants
|   |-- roles.ts

## APIs (Planned)

- POST /api/auth/register — Register a new user (merchant or admin)
- POST /api/auth/login — Login and receive a JWT token
- POST /api/auth/forgot-password — Trigger password reset flow (send email or generate reset token)
- Merchant CRUD — Create / Read / Update merchant profiles
- Hotel CRUD + submit for audit — Merchants manage hotels and submit them for admin review
- Admin endpoints: approve / reject / offline — Admins perform audits and platform governance actions
- GET /api/admin/audit-logs — Query audit logs (admin only)

## Database Schema (Models & Fields)

The following outlines the main collections and the meaning of each field. Models are designed to be decoupled and reflect realistic platform business requirements.

1. User

- Purpose: authentication and authorization
- Fields:
  - _id: unique identifier (ObjectId)
  - email: user's email, used for login
  - password: hashed password
  - role: user role, `merchant` or `admin`
  - status: `active` | `disabled`
  - createdAt: record creation timestamp
  - updatedAt: record update timestamp

2. MerchantProfile

- Purpose: represent the merchant as a business entity
- Fields:
  - _id: unique identifier (ObjectId)
  - userId: reference to `User` (owner account)
  - merchantName: official merchant name
  - contactName: contact person
  - contactPhone: contact phone number
  - contactEmail: contact email
  - businessLicenseNo: optional business license number
  - idCardNo: optional identifier for responsible person
  - verifyStatus: `unverified` | `pending` | `verified` | `rejected`
  - rejectReason: reason for rejection when applicable
  - createdAt, updatedAt

3. AdminProfile

- Purpose: store admin metadata for audit traceability
- Fields:
  - _id: unique identifier
  - userId: reference to `User` (admin account)
  - name: admin name
  - employeeNo: optional employee number
  - createdAt: creation timestamp

4. Hotel

- Purpose: merchant-managed hotel information and the data served to mobile users
- Fields:
  - _id: unique identifier
  - merchantId: reference to `MerchantProfile` (owner)
  - nameCn: Chinese name
  - nameEn: English name (optional)
  - address: address string
  - city: city name
  - star: number of stars (rating)
  - openTime: textual opening info
  - rooms: array of room objects
    - type: room type or name
    - price: numeric price
    - stock: available inventory
    - facilities: the facilities include in the room
    - size: the size of the room
  - images: array of image URLs
  - status: `draft` | `pending` | `approved` | `rejected` | `offline`
  - rejectReason: reason for rejection
  - auditedBy: reference to `AdminProfile` who audited
  - auditedAt: audit timestamp
  - createdAt, updatedAt

5. AuditLog

- Purpose: record every audit action for governance and traceability
- Fields:
  - _id: unique identifier
  - targetType: `hotel` or `merchant`
  - targetId: the ObjectId of the audited target
  - action: `approve` | `reject` | `offline`
  - operatorId: reference to `AdminProfile` who performed the action
  - reason: optional reason for action
  - createdAt: action timestamp

## How to run (Development)

Prerequisites:
- Node.js v18 or later
- pnpm (recommended)
- MongoDB running locally or use a remote connection string

Steps:

1. Clone repository and enter the `pc-admin` folder:

```bash
cd pc-admin
```

2. Install dependencies:

```bash
pnpm install
```

3. Create `.env` file from `.env.example` and set values:

```env
MONGO_URI=mongodb://localhost:27017/estay
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=development
```

4. Start development server (hot reload):

```bash
pnpm run dev
```

Note: On first run a default admin account is created for convenience:
- **Email**: `admin@local`
- **Password**: `admin123`

5. Build and run for production:

```bash
pnpm run build
pnpm start
```

## Next Steps

1. Implement request validation using Zod
2. Harden authentication flows (forgot/reset password email flow)
3. Add integration tests and CI
4. Add file uploads (Multer) and media storage
