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
exports.getMovies = getMovies;
exports.getMovieById = getMovieById;
exports.searchMovies = searchMovies;
exports.addMovie = addMovie;
exports.updateMovie = updateMovie;
exports.deleteMovie = deleteMovie;
const movieServices_1 = require("../services/movieServices");
function getMovies(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const movies = yield movieServices_1.MovieService.getAllMovies();
            res.status(200).json(movies);
        }
        catch (error) {
            console.error("Lỗi lấy danh sách phim:", error);
            res.status(500).json({ message: error.message || "Lỗi server" });
        }
    });
}
function getMovieById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tmdbId = parseInt(req.params.id, 10);
            const movie = yield movieServices_1.MovieService.getMovieById(tmdbId);
            res.status(200).json(movie);
        }
        catch (error) {
            console.error("Lỗi khi lấy phim:", error);
            const message = error.message || "Lỗi khi lấy phim";
            res.status(message.includes("Không tìm thấy") ? 404 : 500).json({ message });
        }
    });
}
function searchMovies(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const title = req.params.title;
            const movies = yield movieServices_1.MovieService.searchMoviesByTitle(title);
            res.status(200).json(movies);
        }
        catch (error) {
            console.error("Lỗi khi tìm kiếm phim:", error);
            res.status(500).json({ message: error.message || "Lỗi khi tìm kiếm phim" });
        }
    });
}
function addMovie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const movie = yield movieServices_1.MovieService.addMovie(req.body);
            res.status(201).json({ message: "Thêm phim thành công", movie });
        }
        catch (error) {
            console.error("Lỗi khi thêm phim:", error);
            res.status(500).json({ message: error.message || "Lỗi khi thêm phim" });
        }
    });
}
function updateMovie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tmdbId = parseInt(req.params.id, 10);
            const updatedMovie = yield movieServices_1.MovieService.updateMovie(tmdbId, req.body);
            res.status(200).json({ message: "Cập nhật thành công", movie: updatedMovie });
        }
        catch (error) {
            console.error("Lỗi khi cập nhật phim:", error);
            const message = error.message || "Lỗi khi cập nhật phim";
            res.status(message.includes("Không tìm thấy") ? 404 : 500).json({ message });
        }
    });
}
function deleteMovie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tmdbId = parseInt(req.params.id, 10);
            yield movieServices_1.MovieService.deleteMovie(tmdbId);
            res.status(200).json({ message: "Xóa thành công" });
        }
        catch (error) {
            console.error("Lỗi khi xóa phim:", error);
            const message = error.message || "Lỗi khi xóa phim";
            res.status(message.includes("Không tìm thấy") ? 404 : 500).json({ message });
        }
    });
}
