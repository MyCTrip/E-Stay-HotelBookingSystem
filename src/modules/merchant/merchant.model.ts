import { Schema, model, Document, Types } from 'mongoose';

export interface IMerchantBaseInfo {
  merchantName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

export interface IMerchantQualificationInfo {
  businessLicenseNo?: string;
  idCardNo?: string;
  realNameStatus: 'unverified' | 'verified' | 'rejected';
}

export interface IMerchantAuditInfo {
  verifyStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  rejectReason?: string;
}

export interface IMerchant extends Document {
  userId: Types.ObjectId;
  baseInfo: IMerchantBaseInfo;
  qualificationInfo: IMerchantQualificationInfo;
  auditInfo: IMerchantAuditInfo;
  createdAt: Date;
  updatedAt: Date;
}

const BaseInfoSchema = new Schema<IMerchantBaseInfo>({
  merchantName: { type: String, required: true },
  contactName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String, required: true }
});

const QualificationSchema = new Schema<IMerchantQualificationInfo>({
  businessLicenseNo: { type: String, unique: true, sparse: true },
  idCardNo: { type: String, unique: true, sparse: true },
  realNameStatus: { type: String, enum: ['unverified', 'verified', 'rejected'], default: 'unverified' }
});

const AuditSchema = new Schema<IMerchantAuditInfo>({
  verifyStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
  rejectReason: String
});

const MerchantSchema = new Schema<IMerchant>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    baseInfo: { type: BaseInfoSchema, required: true },
    qualificationInfo: { type: QualificationSchema, default: {} },
    auditInfo: { type: AuditSchema, default: {} }
  },
  { timestamps: true }
);

export const Merchant = model<IMerchant>('MerchantProfile', MerchantSchema);