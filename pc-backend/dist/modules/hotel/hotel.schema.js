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
// ============ 钟点房时间段 Schema ============
const hourlyTimeSlotSchema = zod_1.z.object({
    dayOfWeek: zod_1.z.number().int().min(0).max(6),
    startTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/),
    endTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/),
    minStayHours: zod_1.z.number().positive(),
    content: zod_1.z.string().min(1),
    maxBookingsPerSlot: zod_1.z.number().positive().optional(),
});
// ============ 酒店 typeConfig Schema ============
const hotelTypeConfigSchema = zod_1.z.object({
    hourly: zod_1.z.object({
        baseConfig: zod_1.z.object({
            pricePerHour: zod_1.z.number().positive().optional(),
            minimumHours: zod_1.z.number().positive().optional(),
            timeSlots: zod_1.z.array(hourlyTimeSlotSchema).optional(),
            cleaningTime: zod_1.z.number().nonnegative().optional(),
            maxBookingsPerDay: zod_1.z.number().positive().optional(),
        }).optional(),
    }).optional(),
    homestay: zod_1.z.object({
        hostName: zod_1.z.string().optional(),
        hostPhone: zod_1.z.string().optional(),
        responseTimeHours: zod_1.z.number().nonnegative().optional(),
        instantBooking: zod_1.z.boolean().optional(),
        minStay: zod_1.z.number().positive().optional(),
        maxStay: zod_1.z.number().positive().optional(),
        cancellationPolicy: zod_1.z.enum(['flexible', 'moderate', 'strict', 'non_refundable']).optional(),
        securityDeposit: zod_1.z.number().nonnegative().optional(),
        amenityTags: zod_1.z.array(zod_1.z.string()).optional(),
    }).optional(),
}).optional();
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
    // 新增字段
    propertyType: zod_1.z.enum(['hotel', 'hourlyHotel', 'homeStay']).optional(),
    location: zod_1.z.object({
        type: zod_1.z.literal('Point').optional(),
        coordinates: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]).optional(),
    }).optional(),
});
exports.createHotelSchema = zod_1.z.object({
    baseInfo: baseInfoSchema,
    checkinInfo: zod_1.z.any().optional(),
    typeConfig: hotelTypeConfigSchema,
});
exports.updateHotelSchema = zod_1.z.object({
    baseInfo: baseInfoSchema.partial().optional(),
    checkinInfo: zod_1.z.any().optional(),
    typeConfig: hotelTypeConfigSchema,
    auditInfo: zod_1.z.any().optional(),
    // allow clients to pass optimistic concurrency fields
    __v: zod_1.z.number().optional(),
    updatedAt: zod_1.z.string().optional(),
});
//# sourceMappingURL=hotel.schema.js.map