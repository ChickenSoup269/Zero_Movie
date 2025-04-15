import { Schema, Document, model, Types } from 'mongoose';

export interface IBooking extends Document {
  userId?: Types.ObjectId;
  movieId: number;
  showtimeId: string;
  seatIds: string[];
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number; 
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  movieId: { type: Number, required: true },
  showtimeId: { type: String, ref: 'Showtime', required: true },
  seatIds: [{ type: String, ref: 'Seat', required: true }],
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  totalPrice: { type: Number, required: true, min: 0 }, 
}, { timestamps: true });

export default model<IBooking>('Booking', bookingSchema);