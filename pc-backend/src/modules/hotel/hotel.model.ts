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

// ============ 钟点房时间段 ============
export interface IHourlyTimeSlot {
  dayOfWeek: number;           // 0-6 周日-周六
  startTime: string;           // "08:00"
  endTime: string;             // "23:00"
  minStayHours: number;        // 最少连住时长
  content: string;             // 详细说明（HTML）
  maxBookingsPerSlot?: number; // 该时段每天最多预订数
}

// ============ 酒店类型配置 ============
export interface IHotelTypeConfig {
  hourly?: {
    baseConfig: {
      pricePerHour?: number;
      minimumHours?: number;
      timeSlots?: IHourlyTimeSlot[];
      cleaningTime?: number;
      maxBookingsPerDay?: number;
    };
  };
  homestay?: {
    hostName?: string;
    hostPhone?: string;
    responseTimeHours?: number;
    instantBooking?: boolean;
    minStay?: number;
    maxStay?: number;
    cancellationPolicy?: 'flexible' | 'moderate' | 'strict' | 'non_refundable';
    securityDeposit?: number;
    amenityTags?: string[];
  };
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
  
  // 新增字段
  propertyType?: 'hotel' | 'hourlyHotel' | 'homeStay'; // 物业类型
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
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
  typeConfig?: IHotelTypeConfig; // 新增：酒店类型特定配置
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
  id: { type: String, required: true },
  name: { type: String, required: true },
  available: { type: Boolean, required: true, default: false },
});

const FacilitySchema = new Schema<IFacility>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  facilities: {
    type: [FacilityItemSchema],
    required: true,
    validate: { validator: (v: any[]) => Array.isArray(v) && v.length > 0, message: 'facilities must be a non-empty array' },
  },
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

const CheckinSchema = new Schema<IHotelCheckinInfo>({
  checkinTime: { type: String, required: true },
  checkoutTime: { type: String, required: true },
  breakfastType: String,
  breakfastPrice: Number,
});

// ============ 钟点房时间段 Schema ============
const HourlyTimeSlotsSchema = new Schema<IHourlyTimeSlot>({
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  minStayHours: { type: Number, required: true, min: 0.5 },
  content: { type: String, required: true },
  maxBookingsPerSlot: Number,
});

// ============ 酒店 typeConfig Schema ============
const HotelTypeConfigSchema = new Schema<IHotelTypeConfig>({
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
    typeConfig: { type: HotelTypeConfigSchema, default: {} }, // 新增
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

// 新增：按物业类型查询
HotelSchema.index({ 'baseInfo.propertyType': 1, 'auditInfo.status': 1 });

// 新增：按城市和物业类型查询
HotelSchema.index({ 'baseInfo.city': 1, 'baseInfo.propertyType': 1 });

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
