import mongoose, { Schema, Document } from "mongoose";

export interface IMovie extends Document {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number; // ID từ TMDB, không cần unique vì đã có trong schema
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  production_countries: { iso_3166_1: string; name: string }[];
  release_date: Date;
  revenue: number;
  runtime: number;
  spoken_languages: { iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

const movieSchema = new Schema<IMovie>({
  adult: { type: Boolean },
  backdrop_path: { type: String },
  belongs_to_collection: {
    id: { type: Number },
    name: { type: String },
    poster_path: { type: String },
    backdrop_path: { type: String },
  },
  budget: { type: Number },
  genres: [{ id: { type: Number }, name: { type: String } }],
  homepage: { type: String },
  id: { type: Number, required: true, unique: true }, // ID từ TMDB
  imdb_id: { type: String },
  origin_country: [{ type: String }],
  original_language: { type: String },
  original_title: { type: String },
  overview: { type: String },
  popularity: { type: Number },
  poster_path: { type: String },
  production_companies: [
    {
      id: { type: Number },
      logo_path: { type: String },
      name: { type: String },
      origin_country: { type: String },
    },
  ],
  production_countries: [
    { iso_3166_1: { type: String }, name: { type: String } },
  ],
  release_date: { type: Date },
  revenue: { type: Number },
  runtime: { type: Number },
  spoken_languages: [{ iso_639_1: { type: String }, name: { type: String } }],
  status: { type: String },
  tagline: { type: String },
  title: { type: String, required: true },
  video: { type: Boolean },
  vote_average: { type: Number },
  vote_count: { type: Number },
});

export default mongoose.model<IMovie>("Movie", movieSchema);
