import { z } from 'zod';

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
