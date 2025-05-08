import { Schema, Document, model, Types } from "mongoose"

export interface IBooking extends Document {
  _id: Types.ObjectId
  userId?: Types.ObjectId
  movieId: number
  showtimeId: Types.ObjectId
  seatIds: Types.ObjectId[]
  status: "pending" | "confirmed" | "cancelled"
  totalPrice: number
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    movieId: { type: Number, required: true },
    showtimeId: {
      type: Schema.Types.ObjectId,
      ref: "Showtime",
      required: true,
      index: true,
    },
    seatIds: [
      { type: Schema.Types.ObjectId, ref: "ShowtimeSeat", required: true },
    ],
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      index: true,
    },
    totalPrice: { type: Number, required: true, min: 0 },
    expiresAt: { type: Date },
  },
  { timestamps: true }
)
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
export default model<IBooking>("Booking", bookingSchema)
