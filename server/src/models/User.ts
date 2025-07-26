import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  password?: string; // hashed in real implementation
  phone?: string;
  dateOfBirth?: string;
  location?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    avatar: { type: String },
    password: { type: String, required: true },
    phone: { type: String },
    dateOfBirth: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema); 