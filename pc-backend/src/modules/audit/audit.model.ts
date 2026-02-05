import { Schema, model, Document, Types } from 'mongoose';

export interface IAudit extends Document {
  targetType: 'hotel' | 'merchant' | 'room';
  targetId: Types.ObjectId;
  action: 'submit' | 'approve' | 'reject' | 'offline' | 'update_request' | 'delete_request';
  operatorId: Types.ObjectId;
  reason?: string;
  createdAt: Date;
}

const AuditSchema = new Schema<IAudit>(
  {
    targetType: { type: String, enum: ['hotel', 'merchant', 'room'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    // actions to track resource lifecycle and requests
    action: { type: String, enum: ['submit', 'approve', 'reject', 'offline', 'update_request', 'delete_request', 'delete'], required: true },
    operatorId: { type: Schema.Types.ObjectId, ref: 'AdminProfile', required: true, index: true },
    reason: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = model<IAudit>('AuditLog', AuditSchema);
