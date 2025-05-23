import { Schema, Document, model, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: 'user' | 'admin';
  points: number;
  resetPasswordCode?: string;
  resetPasswordExpires?: Date;
  avatar?: string;          
  backgroundImage?: string; 
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  points: { type: Number, default: 0 },
  resetPasswordCode: { type: String },
  resetPasswordExpires: { type: Date },
  avatar: { type: String },          
  backgroundImage: { type: String },
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });

export default model<IUser>('User', userSchema);