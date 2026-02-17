"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomAvailability = void 0;
const mongoose_1 = require("mongoose");
const RoomAvailabilitySchema = new mongoose_1.Schema({
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Room', required: true, index: true },
    date: { type: Date, required: true, index: true },
    status: {
        type: String,
        enum: ['available', 'booked', 'blocked'],
        default: 'available',
    },
    priceOverride: { type: Number, min: 0 },
    availableCount: { type: Number, default: 1, min: 0 },
    notes: String,
}, { timestamps: true });
// 重要索引：roomId + date 唯一性
RoomAvailabilitySchema.index({ roomId: 1, date: 1 }, { unique: true });
// 查询特定日期范围内的可用性
RoomAvailabilitySchema.index({ date: 1, status: 1 });
// 查询特定房间的日历数据
RoomAvailabilitySchema.index({ roomId: 1, date: -1 });
exports.RoomAvailability = (0, mongoose_1.model)('RoomAvailability', RoomAvailabilitySchema);
//# sourceMappingURL=availability.model.js.map