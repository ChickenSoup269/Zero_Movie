import { Schema, Document, model } from 'mongoose';
import { Types } from 'mongoose';

export interface ISeat extends Document {
  _id: Types.ObjectId;
  roomId: Types.ObjectId; // Đổi thành ObjectId
  seatNumber: string;
  row: string;
  column: number;
  type: 'standard';
  createdAt?: Date;
  updatedAt?: Date;
}

const seatSchema = new Schema<ISeat>({
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true }, // Sửa thành ObjectId
  seatNumber: { type: String, required: true },
  row: { type: String, required: true, enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] },
  column: { type: Number, required: true, min: 1, max: 18 },
  type: { type: String, enum: ['standard'], default: 'standard' },
}, {
  timestamps: true,
});

seatSchema.index({ roomId: 1, seatNumber: 1 }, { unique: true });
export default model<ISeat>('Seat', seatSchema);