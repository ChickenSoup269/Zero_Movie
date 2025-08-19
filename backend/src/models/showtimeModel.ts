import { Schema, Document, model } from 'mongoose';
import { Types } from 'mongoose';

export interface IShowtime extends Document {
  _id: Types.ObjectId;
  movieId: number; 
  roomId: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  price: number; 
  createdAt?: Date;
  updatedAt?: Date;
}

const showtimeSchema = new Schema<IShowtime>({
  movieId: { type: Number, required: true },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  price: { type: Number, required: true, min: 0 }, 
}, {
  timestamps: true,
});

showtimeSchema.index({ roomId: 1, startTime: 1 }); 
export default model<IShowtime>('Showtime', showtimeSchema);