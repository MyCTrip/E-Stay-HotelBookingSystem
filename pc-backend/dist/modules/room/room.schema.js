"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomSchema = exports.createRoomSchema = void 0;
const zod_1 = require("zod");
const bedSchema = zod_1.z.object({
    bedType: zod_1.z.string().min(1),
    bedNumber: zod_1.z.number().int().min(1),
    bedSize: zod_1.z.string().min(1),
});
const facilityItemSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    available: zod_1.z.boolean(),
});
const facilitySchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    facilities: zod_1.z.array(facilityItemSchema).nonempty(),
});
const policySchema = zod_1.z.object({
    policyType: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
    summary: zod_1.z.string().optional(),
    flags: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.createRoomSchema = zod_1.z.object({
    hotelId: zod_1.z.string().min(1).optional(),
    baseInfo: zod_1.z.object({
        type: zod_1.z.string().min(1),
        price: zod_1.z.number().min(0),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        status: zod_1.z.enum(['draft', 'pending', 'approved', 'rejected', 'offline']).optional(),
        maxOccupancy: zod_1.z.number().int().min(1),
        facilities: zod_1.z.array(facilitySchema).nonempty(),
        policies: zod_1.z.array(policySchema).nonempty(),
        bedRemark: zod_1.z.array(zod_1.z.string().min(1)).nonempty(),
    }),
    headInfo: zod_1.z.object({
        size: zod_1.z.string().min(1),
        floor: zod_1.z.string().min(1),
        wifi: zod_1.z.boolean(),
        windowAvailable: zod_1.z.boolean(),
        smokingAllowed: zod_1.z.boolean(),
    }),
    bedInfo: zod_1.z.array(bedSchema),
    breakfastInfo: zod_1.z.any().optional(),
});
exports.updateRoomSchema = exports.createRoomSchema.partial();
//# sourceMappingURL=room.schema.js.map