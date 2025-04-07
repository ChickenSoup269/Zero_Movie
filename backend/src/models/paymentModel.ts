import { Schema, Document, model, Types } from 'mongoose';

export interface IPayment extends Document {
  bookingId: Types.ObjectId;
  userId?: Types.ObjectId;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'paypal'; // Chỉ dùng PayPal
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentMethod: { type: String, enum: ['paypal'], required: true },
  transactionId: { type: String },
}, { timestamps: true });

export default model<IPayment>('Payment', paymentSchema);