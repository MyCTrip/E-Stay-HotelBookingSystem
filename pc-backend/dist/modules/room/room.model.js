"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const mongoose_1 = require("mongoose");
const BedSchema = new mongoose_1.Schema({
    bedType: { type: String, required: true },
    bedNumber: { type: Number, required: true },
    bedSize: { type: String, required: true },
});
const FacilityItemSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    available: { type: Boolean, required: true },
});
const FacilitySchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    facilities: {
        type: [FacilityItemSchema],
        required: true,
        validate: { validator: (v) => Array.isArray(v) && v.length > 0, message: 'facilities must be a non-empty array' },
    },
});
const PolicySchema = new mongoose_1.Schema({
    policyType: { type: String, required: true },
    content: { type: String, required: true },
    summary: String,
    flags: { type: mongoose_1.Schema.Types.Mixed, default: {} },
});
const BaseInfoSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], required: true },
    maxOccupancy: { type: Number, required: true, min: 0 },
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
    bedRemark: {
        type: [String],
        required: true,
        validate: { validator: (v) => Array.isArray(v) && v.length > 0, message: 'bedRemark must be a non-empty array of strings' },
    },
});
const HeadInfoSchema = new mongoose_1.Schema({
    size: { type: String, required: true },
    floor: { type: String, required: true },
    wifi: { type: Boolean, required: true },
    windowAvailable: { type: Boolean, required: true },
    smokingAllowed: { type: Boolean, required: true },
});
const BreakfastSchema = new mongoose_1.Schema({
    breakfastType: String,
    cuisine: String,
    bussinessTime: String,
    addBreakfast: String,
});
const AuditSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'rejected', 'offline'],
        default: 'draft',
    },
    auditedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'AdminProfile', index: true, default: null },
    auditedAt: { type: Date, default: null },
    rejectReason: String,
});
const RoomSchema = new mongoose_1.Schema({
    hotelId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    baseInfo: { type: BaseInfoSchema, required: true },
    headInfo: { type: HeadInfoSchema, required: true },
    bedInfo: { type: [BedSchema], required: true },
    breakfastInfo: { type: BreakfastSchema, default: {} },
    auditInfo: { type: AuditSchema, default: {} },
    pendingChanges: { type: mongoose_1.Schema.Types.Mixed, default: null },
    pendingDeletion: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, optimisticConcurrency: true });
// 添加复合索引
// 用于查询指定酒店的房型列表，按创建时间排序
RoomSchema.index({ hotelId: 1, createdAt: -1 });
// 用于查询已审核通过的房型
RoomSchema.index({ 'auditInfo.status': 1, createdAt: -1 });
// 用于按房型状态和酒店ID查询
RoomSchema.index({ 'auditInfo.status': 1, hotelId: 1 });
// 用于按价格排序查询
RoomSchema.index({ 'baseInfo.price': 1 });
exports.Room = (0, mongoose_1.model)('Room', RoomSchema);
//# sourceMappingURL=room.model.js.map