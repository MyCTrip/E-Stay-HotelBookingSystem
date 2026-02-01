import { Schema, model, Document, Types } from 'mongoose';

export interface IAdminBaseInfo {
  name: string;
  employeeNo?: string;
}

export interface IAdmin extends Document {
  userId: Types.ObjectId;
  baseInfo: IAdminBaseInfo;
  createdAt: Date;
}

const BaseInfoSchema = new Schema<IAdminBaseInfo>({
  name: { type: String, required: true },
  employeeNo: { type: String, unique: true, sparse: true }
});

const AdminSchema = new Schema<IAdmin>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  baseInfo: { type: BaseInfoSchema, required: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

export const AdminProfile = model<IAdmin>('AdminProfile', AdminSchema);