import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISession extends Document {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const sessionSchema = new Schema<ISession>({
  userId: { type: Schema.Types.ObjectId, ref: "UserAccount", required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISession>("Session", sessionSchema);
