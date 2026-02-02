import { z } from 'zod';

export const merchantBaseInfoSchema = z.object({
  merchantName: z.string().min(1),
  contactName: z.string().min(1),
  contactPhone: z.string().min(1),
  contactEmail: z.string().email(),
});

export const merchantQualificationSchema = z.object({
  businessLicenseNo: z.string().optional(),
  idCardNo: z.string().optional(),
  realNameStatus: z.enum(['unverified', 'verified', 'rejected']).optional(),
});

export const merchantCreateSchema = z.object({
  baseInfo: merchantBaseInfoSchema,
  qualificationInfo: merchantQualificationSchema.optional(),
});

export const merchantUpdateSchema = merchantCreateSchema.partial();

export type MerchantCreateInput = z.infer<typeof merchantCreateSchema>;
export type MerchantUpdateInput = z.infer<typeof merchantUpdateSchema>;
