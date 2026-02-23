"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merchantUpdateSchema = exports.merchantCreateSchema = exports.merchantQualificationSchema = exports.merchantBaseInfoSchema = void 0;
const zod_1 = require("zod");
// 营业执照号格式验证（18位统一社会信用代码）
const businessLicenseRegex = /^[A-Z0-9]{18}$/;
// 身份证号格式验证（18位）
const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
exports.merchantBaseInfoSchema = zod_1.z.object({
    merchantName: zod_1.z.string().min(1),
    contactName: zod_1.z.string().min(1),
    contactPhone: zod_1.z.string().min(1),
    contactEmail: zod_1.z.string().email(),
});
exports.merchantQualificationSchema = zod_1.z.object({
    businessLicenseNo: zod_1.z.string().optional().refine((val) => !val || businessLicenseRegex.test(val), {
        message: '营业执照号格式不正确（18位统一社会信用代码）',
    }),
    businessLicensePhoto: zod_1.z.string().optional(),
    idCardNo: zod_1.z.string().optional().refine((val) => !val || idCardRegex.test(val), {
        message: '身份证号格式不正确（18位）',
    }),
    realNameStatus: zod_1.z.enum(['unverified', 'verified', 'rejected']).optional(),
});
exports.merchantCreateSchema = zod_1.z.object({
    baseInfo: exports.merchantBaseInfoSchema,
    qualificationInfo: exports.merchantQualificationSchema.optional(),
});
exports.merchantUpdateSchema = exports.merchantCreateSchema.partial();
//# sourceMappingURL=merchant.schema.js.map