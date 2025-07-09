import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  password?: string; // hashed in real implementation
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    avatar: { type: String },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Add unique index for email to prevent duplicates
userSchema.index({ email: 1 }, { unique: true });

export default model<IUser>('User', userSchema); 