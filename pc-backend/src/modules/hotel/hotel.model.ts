import { Schema, model, Document, Types } from 'mongoose';

export interface IFacilityItem {
  name: string;
  description?: string;
  icon?: string;
  available?: boolean;
}

export interface IFacility {
  category: string;
  content: string; // HTML rich text
  items?: IFacilityItem[];
  summary?: string;
  icon?: string;
  order?: number;
  visible?: boolean;
}

export interface IPolicy {
  policyType: string;
  content: string; // HTML rich text
  summary?: string;
  flags?: Record<string, any>;
  effectiveFrom?: Date;
}

export interface ISurrounding {
  surType: 'metro' | 'attraction' | 'business';
  surName: string;
  distance: number; // meters
}

export interface IDiscount {
  title: string;
  type: 'discount' | 'instant';
  content: string;
}

export interface IHotelBaseInfo {
  nameCn: string;
  nameEn?: string;
  address: string;
  city: string;
  star: number;
  openTime: string;
  roomTotal: number;
  phone: string;
  description: string;
  images: string[];
  facilities: IFacility[];
  policies: IPolicy[];
  surroundings?: ISurrounding[];
  discounts?: IDiscount[];
}

export interface IHotelCheckinInfo {
  checkinTime: string;
  checkoutTime: string;
  breakfastType?: string;
  breakfastPrice?: number;
}

export interface IHotelAuditInfo {
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';
  auditedBy?: Types.ObjectId | null;
  auditedAt?: Date | null;
  rejectReason?: string;
}

export interface IHotel extends Document {
  merchantId: Types.ObjectId;
  baseInfo: IHotelBaseInfo;
  checkinInfo: IHotelCheckinInfo;
  auditInfo: IHotelAuditInfo;
  // pendingChanges stores merchant-submitted updates awaiting admin approval
  pendingChanges?: Record<string, any> | null;
  // deletion request flag and deletion timestamp
  pendingDeletion?: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const FacilityItemSchema = new Schema<IFacilityItem>({
  name: { type: String, required: true },
  description: String,
  icon: String,
  available: { type: Boolean, default: true },
});

const FacilitySchema = new Schema<IFacility>({
  category: { type: String, required: true },
  content: { type: String, required: true },
  items: { type: [FacilityItemSchema], default: [] },
  summary: String,
  icon: String,
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
});

const PolicySchema = new Schema<IPolicy>({
  policyType: { type: String, required: true },
  content: { type: String, required: true },
  summary: String,
  flags: { type: Schema.Types.Mixed, default: {} },
  effectiveFrom: Date,
});

const SurroundingSchema = new Schema<ISurrounding>({
  surType: { type: String, enum: ['metro', 'attraction', 'business'], required: true },
  surName: { type: String, required: true },
  distance: { type: Number, required: true },
});

const DiscountSchema = new Schema<IDiscount>({
  title: { type: String, required: true },
  type: { type: String, enum: ['discount', 'instant'], required: true },
  content: { type: String, required: true },
});

const BaseInfoSchema = new Schema<IHotelBaseInfo>({
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
    validate: { validator: (v: any[]) => Array.isArray(v) && v.length > 0, message: 'facilities must be a non-empty array' },
  },
  policies: {
    type: [PolicySchema],
    required: true,
    validate: { validator: (v: any[]) => Array.isArray(v) && v.length > 0, message: 'policies must be a non-empty array' },
  },
  surroundings: { type: [SurroundingSchema], default: [] },
  discounts: { type: [DiscountSchema], default: [] },
});

const CheckinSchema = new Schema<IHotelCheckinInfo>({
  checkinTime: { type: String, required: true },
  checkoutTime: { type: String, required: true },
  breakfastType: String,
  breakfastPrice: Number,
});

const AuditInfoSchema = new Schema<IHotelAuditInfo>({
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'offline'],
    default: 'draft',
  },
  auditedBy: { type: Schema.Types.ObjectId, ref: 'AdminProfile', index: true, default: null },
  auditedAt: { type: Date, default: null },
  rejectReason: String,
});

const HotelSchema = new Schema<IHotel>(
  {
    merchantId: { type: Schema.Types.ObjectId, ref: 'MerchantProfile', required: true, index: true },
    baseInfo: { type: BaseInfoSchema, required: true },
    checkinInfo: { type: CheckinSchema, default: {} },
    auditInfo: { type: AuditInfoSchema, default: {} },
    pendingChanges: { type: Schema.Types.Mixed, default: null },
    // merchant-requested delete flag
    pendingDeletion: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, optimisticConcurrency: true }
);

// 添加复合索引
// 用于查询指定商户的酒店列表
HotelSchema.index({ merchantId: 1, createdAt: -1 });

// 用于查询已审核通过的酒店，按创建时间排序
HotelSchema.index({ 'auditInfo.status': 1, createdAt: -1 });

// 用于按城市和星级筛选酒店
HotelSchema.index({ 'baseInfo.city': 1, 'baseInfo.star': -1 });

// 用于按状态和城市筛选酒店
HotelSchema.index({ 'auditInfo.status': 1, 'baseInfo.city': 1 });

// 添加全文搜索索引，用于酒店名称和描述的搜索
HotelSchema.index(
  {
    'baseInfo.nameCn': 'text',
    'baseInfo.nameEn': 'text',
    'baseInfo.description': 'text'
  },
  {
    weights: {
      'baseInfo.nameCn': 10,
      'baseInfo.nameEn': 8,
      'baseInfo.description': 5
    },
    default_language: 'chinese'
  }
);

export const Hotel = model<IHotel>('Hotel', HotelSchema);
