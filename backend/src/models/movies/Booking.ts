import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId; // Liên kết với UserAccount._id
  showtimeId: number; // Liên kết với Showtime.id
  seats: number[]; // Mảng số ghế
  totalPrice: number;
  bookingDate: Date;
  status: "pending" | "confirmed" | "canceled";
}

const bookingSchema = new Schema<IBooking>({
  userId: { type: Schema.Types.ObjectId, ref: "UserAccount", required: true },
  showtimeId: { type: Number, required: true },
  seats: [{ type: Number, required: true }],
  totalPrice: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "confirmed", "canceled"],
    default: "pending",
  },
});

export default mongoose.model<IBooking>("Booking", bookingSchema);
