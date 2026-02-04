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

const BaseInfoSchema = new Schema<IHotelBaseInfo>({
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
    validate: { validator: (v: any[]) => Array.isArray(v) && v.length > 0, message: 'facilities must be a non-empty array' },
  },
  policies: {
    type: [PolicySchema],
    required: true,
    validate: { validator: (v: any[]) => Array.isArray(v) && v.length > 0, message: 'policies must be a non-empty array' },
  },
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
    merchantId: { type: Schema.Types.ObjectId, ref: 'MerchantProfile', required: true },
    baseInfo: { type: BaseInfoSchema, required: true },
    checkinInfo: { type: CheckinSchema, default: {} },
    auditInfo: { type: AuditInfoSchema, default: {} },
  },
  { timestamps: true }
);

export const Hotel = model<IHotel>('Hotel', HotelSchema);
