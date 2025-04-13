import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, 
  name: { type: String, required: true },
});

export const Genre = mongoose.model("Genre", genreSchema);
