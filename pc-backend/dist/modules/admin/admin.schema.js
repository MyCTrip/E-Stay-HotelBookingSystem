"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkActionSchema = exports.auditActionSchema = void 0;
const zod_1 = require("zod");
exports.auditActionSchema = zod_1.z.object({
    reason: zod_1.z.string().min(1).optional(),
});
exports.bulkActionSchema = zod_1.z.object({
    ids: zod_1.z.array(zod_1.z.string().min(1)),
    action: zod_1.z.enum(['approve', 'reject', 'offline']),
    reason: zod_1.z.string().optional(),
});
//# sourceMappingURL=admin.schema.js.map