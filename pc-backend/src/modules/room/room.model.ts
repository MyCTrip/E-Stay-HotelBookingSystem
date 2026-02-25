import { Schema, model, Document, Types } from 'mongoose';

export interface IFacilityItem {
  id: string;
  name: string;
  available: boolean;
}

export interface IFacility {
  id: string;
  name: string;
  facilities: IFacilityItem[];
}

export interface IPolicy {
  policyType: string;
  content: string; // HTML rich text
  summary?: string;
  flags?: Record<string, any>;
}

export interface IBedInfo {
  bedType: string;
  bedNumber: number;
  bedSize: string;
}

export interface IRoomBaseInfo {
  type: string;
  price: number;
  images: string[];
  maxOccupancy: number;
  facilities: IFacility[];
  policies: IPolicy[];
  bedRemark: string[];
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
  // pendingChanges stores merchant-submitted updates awaiting admin approval
  pendingChanges?: Record<string, any> | null;
  pendingDeletion?: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const BedSchema = new Schema<IBedInfo>({
  bedType: { type: String, required: true },
  bedNumber: { type: Number, required: true },
  bedSize: { type: String, required: true },
});

const FacilityItemSchema = new Schema<IFacilityItem>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  available: { type: Boolean, required: true },
});

const FacilitySchema = new Schema<IFacility>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  facilities: { type: [FacilityItemSchema], required: true },
});

const PolicySchema = new Schema<IPolicy>({
  policyType: { type: String, required: true },
  content: { type: String, required: true },
  summary: String,
  flags: { type: Schema.Types.Mixed, default: {} },
});

const BaseInfoSchema = new Schema<IRoomBaseInfo>({
  type: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  images: { type: [String], required: true },
  maxOccupancy: { type: Number, required: true, min: 0 },
  facilities: {
    type: [FacilitySchema],
    required: true,
    validate: { validator: (v: any[]) => Array.isArray(v) && v.length > 0, message: 'facilities must be a non-empty array' },
  },
  policies: {
    type: [PolicySchema],
    required: true,
    validate: { validator: (v: any[]) => Array.isArray(v) && v.length > 0, message: 'policies must be a non-empty array' },
  },
  bedRemark: {
    type: [String],
    required: true,
    validate: { validator: (v: any[]) => Array.isArray(v) && v.length > 0, message: 'bedRemark must be a non-empty array of strings' },
  },
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
    pendingChanges: { type: Schema.Types.Mixed, default: null },
    pendingDeletion: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, optimisticConcurrency: true }
);

// 添加复合索引
// 用于查询指定酒店的房型列表，按创建时间排序
RoomSchema.index({ hotelId: 1, createdAt: -1 });

// 用于查询已审核通过的房型
RoomSchema.index({ 'auditInfo.status': 1, createdAt: -1 });

// 用于按房型状态和酒店ID查询
RoomSchema.index({ 'auditInfo.status': 1, hotelId: 1 });

// 用于按价格排序查询
RoomSchema.index({ 'baseInfo.price': 1 });

export const Room = model<IRoom>('Room', RoomSchema);
