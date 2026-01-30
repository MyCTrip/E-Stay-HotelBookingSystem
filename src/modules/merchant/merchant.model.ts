import { Schema, model, Document, Types } from 'mongoose';

export interface IMerchant extends Document {
  userId: Types.ObjectId;
  merchantName: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  businessLicenseNo?: string;
  idCardNo?: string;
  verifyStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  rejectReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MerchantSchema = new Schema<IMerchant>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    merchantName: { type: String, required: true },
    contactName: String,
    contactPhone: String,
    contactEmail: String,
    businessLicenseNo: String,
    idCardNo: String,
    verifyStatus: { type: String, default: 'unverified' },
    rejectReason: String
  },
  { timestamps: true }
);

export const Merchant = model<IMerchant>('MerchantProfile', MerchantSchema);