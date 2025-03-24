import mongoose, { Schema, Document } from "mongoose";

export interface IGuestSession extends Document {
  guestSessionId: string;
  expiresAt: Date;
  createdAt: Date;
}

const guestSessionSchema = new Schema<IGuestSession>({
  guestSessionId: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IGuestSession>("GuestSession", guestSessionSchema);