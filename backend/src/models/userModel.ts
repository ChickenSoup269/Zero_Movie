import mongoose, { Schema, Document, model, Types } from "mongoose"

export interface IUser extends mongoose.Document {
  username: string
  email: string
  password: string
  fullName: string
  role: string
  points: number
  avatar: string
  backgroundImage: string
  resetPasswordCode?: string
  resetPasswordExpires?: Date
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, default: "user" },
  points: { type: Number, default: 0 },
  avatar: { type: String, default: "" },
  backgroundImage: { type: String, default: "" },
  resetPasswordCode: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },
})

userSchema.index({ email: 1 }, { unique: true })

export default model<IUser>("User", userSchema)
