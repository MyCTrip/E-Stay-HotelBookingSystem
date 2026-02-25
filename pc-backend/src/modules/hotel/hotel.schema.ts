import { z } from 'zod';

const facilityItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  available: z.boolean(),
});

const facilitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  facilities: z.array(facilityItemSchema).nonempty(),
});

const policySchema = z.object({
  policyType: z.string().min(1),
  content: z.string().min(1), // supports HTML rich text
  summary: z.string().optional(),
  flags: z.record(z.any()).optional(),
  effectiveFrom: z.string().optional(),
});

const surroundingSchema = z.object({
  surType: z.enum(['metro', 'attraction', 'business']),
  surName: z.string().min(1),
  distance: z.number().nonnegative(),
});

const discountSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['discount', 'instant']),
  content: z.string().min(1),
});

// ============ 钟点房时间段 Schema ============
const hourlyTimeSlotSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  minStayHours: z.number().positive(),
  content: z.string().min(1),
  maxBookingsPerSlot: z.number().positive().optional(),
});

// ============ 酒店 typeConfig Schema ============
const hotelTypeConfigSchema = z.object({
  hourly: z.object({
    baseConfig: z.object({
      pricePerHour: z.number().positive().optional(),
      minimumHours: z.number().positive().optional(),
      timeSlots: z.array(hourlyTimeSlotSchema).optional(),
      cleaningTime: z.number().nonnegative().optional(),
      maxBookingsPerDay: z.number().positive().optional(),
    }).optional(),
  }).optional(),
  
  homestay: z.object({
    hostName: z.string().optional(),
    hostPhone: z.string().optional(),
    responseTimeHours: z.number().nonnegative().optional(),
    instantBooking: z.boolean().optional(),
    minStay: z.number().positive().optional(),
    maxStay: z.number().positive().optional(),
    cancellationPolicy: z.enum(['flexible', 'moderate', 'strict', 'non_refundable']).optional(),
    securityDeposit: z.number().nonnegative().optional(),
    amenityTags: z.array(z.string()).optional(),
  }).optional(),
}).optional();

const baseInfoSchema = z.object({
  nameCn: z.string().min(1),
  nameEn: z.string().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  star: z.number().int().min(0).max(5).optional(),
  openTime: z.string().optional(),
  roomTotal: z.number().int().min(0).optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  facilities: z.array(facilitySchema).nonempty(),
  policies: z.array(policySchema).nonempty(),
  surroundings: z.array(surroundingSchema).optional(),
  discounts: z.array(discountSchema).optional(),
  
  // 新增字段
  propertyType: z.enum(['hotel', 'hourlyHotel', 'homeStay']).optional(),
  location: z.object({
    type: z.literal('Point').optional(),
    coordinates: z.tuple([z.number(), z.number()]).optional(),
  }).optional(),
});

export const createHotelSchema = z.object({
  baseInfo: baseInfoSchema,
  checkinInfo: z.any().optional(),
  typeConfig: hotelTypeConfigSchema,
});

export const updateHotelSchema = z.object({
  baseInfo: baseInfoSchema.partial().optional(),
  checkinInfo: z.any().optional(),
  typeConfig: hotelTypeConfigSchema,
  auditInfo: z.any().optional(),
  // allow clients to pass optimistic concurrency fields
  __v: z.number().optional(),
  updatedAt: z.string().optional(),
});

export type CreateHotelInput = z.infer<typeof createHotelSchema>;
export type UpdateHotelInput = z.infer<typeof updateHotelSchema>;
