"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieService = void 0;
const movieModel_1 = require("../models/movieModel");
class MovieService {
    static getAllMovies() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield movieModel_1.Movie.find();
            }
            catch (error) {
                throw new Error("Lỗi khi lấy danh sách phim");
            }
        });
    }
    static getMovieById(tmdbId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const movie = yield movieModel_1.Movie.findOne({ tmdbId });
                if (!movie)
                    throw new Error("Không tìm thấy phim");
                return movie;
            }
            catch (error) {
                throw error instanceof Error ? error : new Error("Lỗi khi lấy phim");
            }
        });
    }
    static searchMoviesByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield movieModel_1.Movie.find({ title: new RegExp(title, "i") });
            }
            catch (error) {
                throw new Error("Lỗi khi tìm kiếm phim");
            }
        });
    }
    static addMovie(movieData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMovie = new movieModel_1.Movie(movieData);
                return yield newMovie.save();
            }
            catch (error) {
                throw new Error("Lỗi khi thêm phim");
            }
        });
    }
    static updateMovie(tmdbId, movieData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedMovie = yield movieModel_1.Movie.findOneAndUpdate({ tmdbId }, movieData, { new: true });
                if (!updatedMovie)
                    throw new Error("Không tìm thấy phim");
                return updatedMovie;
            }
            catch (error) {
                throw error instanceof Error ? error : new Error("Lỗi khi cập nhật phim");
            }
        });
    }
    static deleteMovie(tmdbId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedMovie = yield movieModel_1.Movie.findOneAndDelete({ tmdbId });
                if (!deletedMovie)
                    throw new Error("Không tìm thấy phim");
                return deletedMovie;
            }
            catch (error) {
                throw new Error("Lỗi khi xóa phim");
            }
        });
    }
}
exports.MovieService = MovieService;
