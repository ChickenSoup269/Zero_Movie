"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const movieSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
exports.Movie = mongoose_1.default.model('Movie', movieSchema);
