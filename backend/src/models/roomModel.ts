import { Schema, Document, model } from 'mongoose';
import { Types } from 'mongoose';

export interface IRoom extends Document {
  _id: Types.ObjectId;
  cinemaId: string;
  roomNumber: string;
  capacity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const roomSchema = new Schema<IRoom>({
  cinemaId: { type: String, ref: 'Cinema', required: true },
  roomNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
}, {
  timestamps: true,
});

roomSchema.index({ cinemaId: 1, roomNumber: 1 }, { unique: true });
export default model<IRoom>('Room', roomSchema);