import { Schema, model, Document, Types } from 'mongoose';

export type NotificationType = 'audit_pending' | 'audit_approved' | 'audit_rejected' | 'update_request';
export type NotificationTargetType = 'merchant' | 'hotel' | 'room';

export interface INotification extends Document {
  userId: Types.ObjectId; // 接收用户 ID（admin 或 merchant user）
  senderType: 'admin' | 'system'; // 发送方类型
  type: NotificationType; // 通知类型
  targetType: NotificationTargetType; // 目标资源类型
  targetId: Types.ObjectId; // 目标资源 ID
  message: string; // 通知文案
  meta?: Record<string, any>; // 元数据
  read?: boolean; // 已读标记
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    senderType: { type: String, enum: ['admin', 'system'], default: 'system' },
    type: { type: String, enum: ['audit_pending', 'audit_approved', 'audit_rejected', 'update_request'], required: true },
    targetType: { type: String, enum: ['merchant', 'hotel', 'room'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    message: { type: String, required: true },
    meta: { type: Schema.Types.Mixed, default: {} },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// 组合索引：按用户查询未读通知
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = model<INotification>('Notification', NotificationSchema);
