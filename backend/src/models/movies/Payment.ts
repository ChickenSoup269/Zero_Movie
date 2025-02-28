import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId; // Liên kết với Booking._id
  amount: number;
  paymentDate: Date;
  method: "credit_card" | "cash" | "online";
  status: "pending" | "completed" | "failed";
}

const paymentSchema = new Schema<IPayment>({
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  method: {
    type: String,
    enum: ["credit_card", "cash", "online"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
});

export default mongoose.model<IPayment>("Payment", paymentSchema);
