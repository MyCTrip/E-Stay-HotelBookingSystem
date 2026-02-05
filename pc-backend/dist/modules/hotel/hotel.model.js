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
    star: { type: Number, required: true },
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
});
const CheckinSchema = new mongoose_1.Schema({
    checkinTime: { type: String, required: true },
    checkoutTime: { type: String, required: true },
    breakfastType: String,
    breakfastPrice: Number,
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
    merchantId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'MerchantProfile', required: true },
    baseInfo: { type: BaseInfoSchema, required: true },
    checkinInfo: { type: CheckinSchema, default: {} },
    auditInfo: { type: AuditInfoSchema, default: {} },
    pendingChanges: { type: mongoose_1.Schema.Types.Mixed, default: null },
    // merchant-requested delete flag
    pendingDeletion: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, optimisticConcurrency: true });
exports.Hotel = (0, mongoose_1.model)('Hotel', HotelSchema);
//# sourceMappingURL=hotel.model.js.map