import { z } from 'zod';

// 营业执照号格式验证（18位统一社会信用代码）
const businessLicenseRegex = /^[A-Z0-9]{18}$/;
// 身份证号格式验证（18位）
const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;

export const merchantBaseInfoSchema = z.object({
  merchantName: z.string().min(1),
  contactName: z.string().min(1),
  contactPhone: z.string().min(1),
  contactEmail: z.string().email(),
});

export const merchantQualificationSchema = z.object({
  businessLicenseNo: z.string().optional().refine((val) => !val || businessLicenseRegex.test(val), {
    message: '营业执照号格式不正确（18位统一社会信用代码）',
  }),
  businessLicensePhoto: z.string().optional(),
  idCardNo: z.string().optional().refine((val) => !val || idCardRegex.test(val), {
    message: '身份证号格式不正确（18位）',
  }),
  realNameStatus: z.enum(['unverified', 'verified', 'rejected']).optional(),
});

export const merchantCreateSchema = z.object({
  baseInfo: merchantBaseInfoSchema,
  qualificationInfo: merchantQualificationSchema.optional(),
});

export const merchantUpdateSchema = merchantCreateSchema.partial();

export type MerchantCreateInput = z.infer<typeof merchantCreateSchema>;
export type MerchantUpdateInput = z.infer<typeof merchantUpdateSchema>;
