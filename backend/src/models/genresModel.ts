import mongoose from 'mongoose';

export interface IGenre extends Document {
  id: number;
  name: string;
}

const genreSchema = new mongoose.Schema<IGenre>({
  id: { type: Number, required: true, unique: true, index: true },
  name: { type: String, required: true },
});

export const Genre = mongoose.model<IGenre>('Genre', genreSchema);