import { Schema, model, Document, Types } from 'mongoose';

export interface IRoomAvailability extends Document {
  roomId: Types.ObjectId;
  date: Date;
  status: 'available' | 'booked' | 'blocked';
  priceOverride?: number;
  availableCount?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoomAvailabilitySchema = new Schema<IRoomAvailability>(
  {
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true, index: true },
    date: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ['available', 'booked', 'blocked'],
      default: 'available',
    },
    priceOverride: { type: Number, min: 0 },
    availableCount: { type: Number, default: 1, min: 0 },
    notes: String,
  },
  { timestamps: true }
);

// 重要索引：roomId + date 唯一性
RoomAvailabilitySchema.index({ roomId: 1, date: 1 }, { unique: true });

// 查询特定日期范围内的可用性
RoomAvailabilitySchema.index({ date: 1, status: 1 });

// 查询特定房间的日历数据
RoomAvailabilitySchema.index({ roomId: 1, date: -1 });

export const RoomAvailability = model<IRoomAvailability>('RoomAvailability', RoomAvailabilitySchema);
