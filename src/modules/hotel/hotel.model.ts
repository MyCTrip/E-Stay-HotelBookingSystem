import { Schema, model, Document, Types } from 'mongoose';

export interface IRoom {
  type: string;
  price: number;
  stock: number;
  facilities: string[]; 
  size: number; 
}

export interface IHotel extends Document {
  merchantId: Types.ObjectId;
  nameCn: string;
  nameEn?: string;
  address?: string;
  city?: string;
  star?: number;
  openTime?: string;
  rooms: IRoom[];
  images: string[];
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';
  rejectReason?: string;
  auditedBy?: Types.ObjectId;
  auditedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>({
  type: String,
  price: Number,
  stock: Number,
  facilities: [String],
  size: Number
});

const HotelSchema = new Schema<IHotel>(
  {
    merchantId: { type: Schema.Types.ObjectId, ref: 'MerchantProfile', required: true },
    nameCn: { type: String, required: true },
    nameEn: String,
    address: String,
    city: String,
    star: Number,
    openTime: String,
    rooms: [RoomSchema],
    images: [String],
    status: { type: String, default: 'draft' },
    rejectReason: String,
    auditedBy: { type: Schema.Types.ObjectId, ref: 'AdminProfile' },
    auditedAt: Date
  },
  { timestamps: true }
);

export const Hotel = model<IHotel>('Hotel', HotelSchema);