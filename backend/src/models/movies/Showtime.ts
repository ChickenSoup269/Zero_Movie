import mongoose, { Schema, Document } from "mongoose";

export interface IShowtime extends Document {
  movieId: number; // Liên kết với Movie.id
  theaterId: number; // Liên kết với Theater.id
  startTime: Date;
  endTime: Date;
  price: number;
  availableSeats: number;
}

const showtimeSchema = new Schema<IShowtime>({
  movieId: { type: Number, required: true },
  theaterId: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
});

export default mongoose.model<IShowtime>("Showtime", showtimeSchema);
