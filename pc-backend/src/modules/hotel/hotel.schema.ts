import { z } from 'zod';

const facilityItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  available: z.boolean().optional().default(true),
});

const facilitySchema = z.object({
  category: z.string().min(1),
  content: z.string().min(1), // supports HTML rich text
  items: z.array(facilityItemSchema).optional(),
  summary: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
  visible: z.boolean().optional(),
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
});

export const createHotelSchema = z.object({
  baseInfo: baseInfoSchema,
  checkinInfo: z.any().optional(),
});

export const updateHotelSchema = z.object({
  baseInfo: baseInfoSchema.partial().optional(),
  checkinInfo: z.any().optional(),
  auditInfo: z.any().optional(),
});

export type CreateHotelInput = z.infer<typeof createHotelSchema>;
export type UpdateHotelInput = z.infer<typeof updateHotelSchema>;
