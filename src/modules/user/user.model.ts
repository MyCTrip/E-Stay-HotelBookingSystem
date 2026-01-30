import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'merchant' | 'admin';
  status: 'active' | 'disabled';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['merchant', 'admin'], default: 'merchant' },
    status: { type: String, enum: ['active', 'disabled'], default: 'active' }
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);