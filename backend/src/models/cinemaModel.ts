import { Schema, Document, model } from 'mongoose';
import { Types } from 'mongoose';

export interface ICinema extends Document {
  _id: Types.ObjectId;
  name: string;
  address: string;
  createdAt?: Date; 
  updatedAt?: Date; 
}

const cinemaSchema = new Schema<ICinema>({
  name: { type: String, required: true },
  address: { type: String, required: true, unique: true },
}, {
  timestamps: true, 
});

export default model<ICinema>('Cinema', cinemaSchema);