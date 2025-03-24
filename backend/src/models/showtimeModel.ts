import { Schema, Document, model } from 'mongoose';
import { Types } from 'mongoose';

export interface IShowtime extends Document {
  _id: Types.ObjectId;
  movieId: number; 
  roomId: string;  
  startTime: Date;
  endTime: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const showtimeSchema = new Schema<IShowtime>({
  movieId: { type: Number, required: true },
  roomId: { type: String, ref: 'Room', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
}, {
  timestamps: true,
});

showtimeSchema.index({ roomId: 1, startTime: 1 }); // Index để kiểm tra xung đột nhanh
export default model<IShowtime>('Showtime', showtimeSchema);