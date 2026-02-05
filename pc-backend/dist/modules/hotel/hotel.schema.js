"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHotelSchema = exports.createHotelSchema = void 0;
const zod_1 = require("zod");
const facilityItemSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    available: zod_1.z.boolean().optional().default(true),
});
const facilitySchema = zod_1.z.object({
    category: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1), // supports HTML rich text
    items: zod_1.z.array(facilityItemSchema).optional(),
    summary: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    order: zod_1.z.number().optional(),
    visible: zod_1.z.boolean().optional(),
});
const policySchema = zod_1.z.object({
    policyType: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1), // supports HTML rich text
    summary: zod_1.z.string().optional(),
    flags: zod_1.z.record(zod_1.z.any()).optional(),
    effectiveFrom: zod_1.z.string().optional(),
});
const surroundingSchema = zod_1.z.object({
    surType: zod_1.z.enum(['metro', 'attraction', 'business']),
    surName: zod_1.z.string().min(1),
    distance: zod_1.z.number().nonnegative(),
});
const discountSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    type: zod_1.z.enum(['discount', 'instant']),
    content: zod_1.z.string().min(1),
});
const baseInfoSchema = zod_1.z.object({
    nameCn: zod_1.z.string().min(1),
    nameEn: zod_1.z.string().optional(),
    address: zod_1.z.string().min(1),
    city: zod_1.z.string().min(1),
    star: zod_1.z.number().int().min(0).max(5).optional(),
    openTime: zod_1.z.string().optional(),
    roomTotal: zod_1.z.number().int().min(0).optional(),
    phone: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    facilities: zod_1.z.array(facilitySchema).nonempty(),
    policies: zod_1.z.array(policySchema).nonempty(),
    surroundings: zod_1.z.array(surroundingSchema).optional(),
    discounts: zod_1.z.array(discountSchema).optional(),
});
exports.createHotelSchema = zod_1.z.object({
    baseInfo: baseInfoSchema,
    checkinInfo: zod_1.z.any().optional(),
});
exports.updateHotelSchema = zod_1.z.object({
    baseInfo: baseInfoSchema.partial().optional(),
    checkinInfo: zod_1.z.any().optional(),
    auditInfo: zod_1.z.any().optional(),
    // allow clients to pass optimistic concurrency fields
    __v: zod_1.z.number().optional(),
    updatedAt: zod_1.z.string().optional(),
});
//# sourceMappingURL=hotel.schema.js.map