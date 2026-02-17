"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hotel = void 0;
const mongoose_1 = require("mongoose");
const FacilityItemSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: String,
    icon: String,
    available: { type: Boolean, default: true },
});
const FacilitySchema = new mongoose_1.Schema({
    category: { type: String, required: true },
    content: { type: String, required: true },
    items: { type: [FacilityItemSchema], default: [] },
    summary: String,
    icon: String,
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
});
const PolicySchema = new mongoose_1.Schema({
    policyType: { type: String, required: true },
    content: { type: String, required: true },
    summary: String,
    flags: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    effectiveFrom: Date,
});
const SurroundingSchema = new mongoose_1.Schema({
    surType: { type: String, enum: ['metro', 'attraction', 'business'], required: true },
    surName: { type: String, required: true },
    distance: { type: Number, required: true },
});
const DiscountSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['discount', 'instant'], required: true },
    content: { type: String, required: true },
});
const BaseInfoSchema = new mongoose_1.Schema({
    nameCn: { type: String, required: true },
    nameEn: String,
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    star: { type: Number, required: true, index: true },
    openTime: { type: String, required: true },
    roomTotal: { type: Number, required: true },
    phone: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    facilities: {
        type: [FacilitySchema],
        required: true,
        validate: { validator: (v) => Array.isArray(v) && v.length > 0, message: 'facilities must be a non-empty array' },
    },
    policies: {
        type: [PolicySchema],
        required: true,
        validate: { validator: (v) => Array.isArray(v) && v.length > 0, message: 'policies must be a non-empty array' },
    },
    surroundings: { type: [SurroundingSchema], default: [] },
    discounts: { type: [DiscountSchema], default: [] },
    // 新增字段
    propertyType: {
        type: String,
        enum: ['hotel', 'hourlyHotel', 'homeStay'],
        default: 'hotel',
        required: true,
        index: true,
    },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], index: '2dsphere' },
    },
});
const CheckinSchema = new mongoose_1.Schema({
    checkinTime: { type: String, required: true },
    checkoutTime: { type: String, required: true },
    breakfastType: String,
    breakfastPrice: Number,
});
// ============ 钟点房时间段 Schema ============
const HourlyTimeSlotsSchema = new mongoose_1.Schema({
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    minStayHours: { type: Number, required: true, min: 0.5 },
    content: { type: String, required: true },
    maxBookingsPerSlot: Number,
});
// ============ 酒店 typeConfig Schema ============
const HotelTypeConfigSchema = new mongoose_1.Schema({
    hourly: {
        baseConfig: {
            pricePerHour: { type: Number, min: 0 },
            minimumHours: { type: Number, min: 0.5 },
            timeSlots: { type: [HourlyTimeSlotsSchema], default: [] },
            cleaningTime: { type: Number, default: 45, min: 0 },
            maxBookingsPerDay: { type: Number, default: 4, min: 1 },
        },
    },
    homestay: {
        hostName: String,
        hostPhone: String,
        responseTimeHours: Number,
        instantBooking: { type: Boolean, default: true },
        minStay: { type: Number, default: 1 },
        maxStay: Number,
        cancellationPolicy: String,
        securityDeposit: { type: Number, min: 0 },
        amenityTags: { type: [String], default: [] },
    },
});
const AuditInfoSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'rejected', 'offline'],
        default: 'draft',
    },
    auditedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'AdminProfile', index: true, default: null },
    auditedAt: { type: Date, default: null },
    rejectReason: String,
});
const HotelSchema = new mongoose_1.Schema({
    merchantId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'MerchantProfile', required: true, index: true },
    baseInfo: { type: BaseInfoSchema, required: true },
    checkinInfo: { type: CheckinSchema, default: {} },
    typeConfig: { type: HotelTypeConfigSchema, default: {} }, // 新增
    auditInfo: { type: AuditInfoSchema, default: {} },
    pendingChanges: { type: mongoose_1.Schema.Types.Mixed, default: null },
    // merchant-requested delete flag
    pendingDeletion: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, optimisticConcurrency: true });
// 添加复合索引
// 用于查询指定商户的酒店列表
HotelSchema.index({ merchantId: 1, createdAt: -1 });
// 用于查询已审核通过的酒店，按创建时间排序
HotelSchema.index({ 'auditInfo.status': 1, createdAt: -1 });
// 用于按城市和星级筛选酒店
HotelSchema.index({ 'baseInfo.city': 1, 'baseInfo.star': -1 });
// 用于按状态和城市筛选酒店
HotelSchema.index({ 'auditInfo.status': 1, 'baseInfo.city': 1 });
// 新增：按物业类型查询
HotelSchema.index({ 'baseInfo.propertyType': 1, 'auditInfo.status': 1 });
// 新增：按城市和物业类型查询
HotelSchema.index({ 'baseInfo.city': 1, 'baseInfo.propertyType': 1 });
// 添加全文搜索索引，用于酒店名称和描述的搜索
HotelSchema.index({
    'baseInfo.nameCn': 'text',
    'baseInfo.nameEn': 'text',
    'baseInfo.description': 'text'
}, {
    weights: {
        'baseInfo.nameCn': 10,
        'baseInfo.nameEn': 8,
        'baseInfo.description': 5
    },
    default_language: 'chinese'
});
exports.Hotel = (0, mongoose_1.model)('Hotel', HotelSchema);
//# sourceMappingURL=hotel.model.js.map