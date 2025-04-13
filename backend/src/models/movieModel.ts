import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  tmdbId: { type: Number, required: true, unique: true }, 
  title: { type: String, required: true },
  originalTitle: { type: String, required: true },
  originalLanguage: { type: String, required: true },
  overview: { type: String, required: true },
  releaseDate: { type: String },
  posterPath: { type: String },
  backdropPath: { type: String },
  popularity: { type: Number },
  voteAverage: { type: Number },
  voteCount: { type: Number },
  adult: { type: Boolean },
  video: { type: Boolean },
  genreIds: { type: [Number], required: true },
}, { timestamps: true });

export const Movie = mongoose.model("Movie", movieSchema);
