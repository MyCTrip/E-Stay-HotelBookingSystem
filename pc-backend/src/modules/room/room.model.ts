import { Schema, model, Document, Types } from 'mongoose';

export interface IBedInfo {
  bedType: string;
  bedNumber: number;
  bedSize: string;
}

export interface IRoomBaseInfo {
  type: string;
  price: number;
  images: string[];
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';
  maxOccupancy: number;
}

export interface IRoomHeadInfo {
  size: string; // textual description, e.g., '25 sqm'
  floor: string;
  wifi: boolean;
  windowAvailable: boolean;
  smokingAllowed: boolean;
}

export interface IBreakfastInfo {
  breakfastType?: string;
  cuisine?: string;
  bussinessTime?: string;
  addBreakfast?: string;
}

export interface IRoomAuditInfo {
  status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';
  auditedBy?: Types.ObjectId | null;
  auditedAt?: Date | null;
  rejectReason?: string;
}

export interface IRoom extends Document {
  hotelId: Types.ObjectId;
  baseInfo: IRoomBaseInfo;
  headInfo: IRoomHeadInfo;
  bedInfo: IBedInfo[];
  breakfastInfo?: IBreakfastInfo;
  auditInfo?: IRoomAuditInfo;
  createdAt: Date;
  updatedAt: Date;
}

const BedSchema = new Schema<IBedInfo>({
  bedType: { type: String, required: true },
  bedNumber: { type: Number, required: true },
  bedSize: { type: String, required: true },
});

const BaseInfoSchema = new Schema<IRoomBaseInfo>({
  type: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  images: { type: [String], required: true },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'offline'],
    required: true,
  },
  maxOccupancy: { type: Number, required: true, min: 0 },
});

const HeadInfoSchema = new Schema<IRoomHeadInfo>({
  size: { type: String, required: true },
  floor: { type: String, required: true },
  wifi: { type: Boolean, required: true },
  windowAvailable: { type: Boolean, required: true },
  smokingAllowed: { type: Boolean, required: true },
});

const BreakfastSchema = new Schema<IBreakfastInfo>({
  breakfastType: String,
  cuisine: String,
  bussinessTime: String,
  addBreakfast: String,
});

const AuditSchema = new Schema<IRoomAuditInfo>({
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'offline'],
    default: 'draft',
  },
  auditedBy: { type: Schema.Types.ObjectId, ref: 'AdminProfile', index: true, default: null },
  auditedAt: { type: Date, default: null },
  rejectReason: String,
});

const RoomSchema = new Schema<IRoom>(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    baseInfo: { type: BaseInfoSchema, required: true },
    headInfo: { type: HeadInfoSchema, required: true },
    bedInfo: { type: [BedSchema], required: true },
    breakfastInfo: { type: BreakfastSchema, default: {} },
    auditInfo: { type: AuditSchema, default: {} },
  },
  { timestamps: true }
);

export const Room = model<IRoom>('Room', RoomSchema);
