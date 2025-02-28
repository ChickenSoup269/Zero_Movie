import mongoose, { Schema, Document } from "mongoose";

export interface ITheater extends Document {
  id: number;
  name: string;
  location: string;
  capacity: number;
}

const theaterSchema = new Schema<ITheater>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
});

export default mongoose.model<ITheater>("Theater", theaterSchema);
