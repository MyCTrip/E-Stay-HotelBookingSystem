import { Schema, model, Document, Types } from 'mongoose';

export interface IAudit extends Document {
  targetType: 'hotel' | 'merchant';
  targetId: Types.ObjectId;
  action: 'approve' | 'reject' | 'offline';
  operatorId: Types.ObjectId;
  reason?: string;
  createdAt: Date;
}

const AuditSchema = new Schema<IAudit>(
  {
    targetType: { type: String, enum: ['hotel', 'merchant'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    action: { type: String, enum: ['approve', 'reject', 'offline'], required: true },
    operatorId: { type: Schema.Types.ObjectId, ref: 'AdminProfile', required: true },
    reason: String
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = model<IAudit>('AuditLog', AuditSchema);