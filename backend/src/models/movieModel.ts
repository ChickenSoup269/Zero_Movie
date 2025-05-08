import mongoose, { Document } from "mongoose"

export interface IMovie extends Document {
  tmdbId: number
  title: string
  originalTitle: string
  originalLanguage: string
  overview: string
  releaseDate?: Date
  posterPath?: string
  backdropPath?: string
  popularity?: number
  voteAverage?: number
  voteCount?: number
  adult?: boolean
  video?: boolean
  genreIds: number[]
  status?: "upcoming" | "nowPlaying" | "discontinued"
  activePeriod?: {
    start: Date
    end: Date
  }
  createdAt: Date
  updatedAt: Date
}

const movieSchema = new mongoose.Schema<IMovie>(
  {
    tmdbId: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true },
    originalTitle: { type: String, required: true },
    originalLanguage: { type: String, required: true },
    overview: { type: String, required: true },
    releaseDate: { type: Date },
    posterPath: { type: String },
    backdropPath: { type: String },
    popularity: { type: Number },
    voteAverage: { type: Number },
    voteCount: { type: Number },
    adult: { type: Boolean, default: false },
    video: { type: Boolean, default: false },
    genreIds: { type: [Number], required: true },
    status: {
      type: String,
      enum: ["upcoming", "nowPlaying", "discontinued"],
      default: "upcoming",
    },
    activePeriod: {
      start: { type: Date },
      end: { type: Date },
    },
  },
  { timestamps: true }
)
movieSchema.index({ title: "text" }, { default_language: "none" })
export const Movie = mongoose.model<IMovie>("Movie", movieSchema)
