import mongoose, { Schema, Document } from "mongoose";

export interface ICast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface ICrew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
  department: string;
  job: string;
}

export interface IMovieCredits extends Document {
  id: number; // ID của phim từ TMDB
  cast: ICast[];
  crew: ICrew[];
}

const movieCreditsSchema = new Schema<IMovieCredits>({
  id: { type: Number, required: true, unique: true },
  cast: [
    {
      adult: { type: Boolean },
      gender: { type: Number },
      id: { type: Number },
      known_for_department: { type: String },
      name: { type: String },
      original_name: { type: String },
      popularity: { type: Number },
      profile_path: { type: String },
      cast_id: { type: Number },
      character: { type: String },
      credit_id: { type: String },
      order: { type: Number },
    },
  ],
  crew: [
    {
      adult: { type: Boolean },
      gender: { type: Number },
      id: { type: Number },
      known_for_department: { type: String },
      name: { type: String },
      original_name: { type: String },
      popularity: { type: Number },
      profile_path: { type: String },
      credit_id: { type: String },
      department: { type: String },
      job: { type: String },
    },
  ],
});

export default mongoose.model<IMovieCredits>(
  "MovieCredits",
  movieCreditsSchema
);
