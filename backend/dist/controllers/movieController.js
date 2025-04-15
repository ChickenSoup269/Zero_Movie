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
exports.MovieController = void 0;
const movieServices_1 = require("../services/movieServices");
class MovieController {
    static getAllMovies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const movies = yield movieServices_1.MovieService.getAllMovies();
                res.status(200).json({ message: 'Lấy danh sách phim thành công', movies });
            }
            catch (error) {
                res.status(500).json({ message: error.message || 'Lỗi khi lấy danh sách phim' });
            }
        });
    }
    static getMovieById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tmdbId = parseInt(req.params.tmdbId);
                const movie = yield movieServices_1.MovieService.getMovieById(tmdbId);
                res.status(200).json({ message: 'Lấy thông tin phim thành công', movie });
            }
            catch (error) {
                res.status(error instanceof Error && error.message === 'Không tìm thấy phim' ? 404 : 500).json({
                    message: error.message || 'Lỗi khi lấy thông tin phim',
                });
            }
        });
    }
    static searchMovies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { q } = req.query;
                if (!q || typeof q !== 'string') {
                    res.status(400).json({ message: 'Thiếu query tìm kiếm' });
                    return;
                }
                const movies = yield movieServices_1.MovieService.searchMoviesByTitle(q);
                res.status(200).json({ message: 'Tìm kiếm phim thành công', movies });
            }
            catch (error) {
                res.status(500).json({ message: error.message || 'Lỗi khi tìm kiếm phim' });
            }
        });
    }
    static addMovie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const movieData = req.body;
                const movie = yield movieServices_1.MovieService.addMovie(movieData);
                res.status(201).json({ message: 'Thêm phim thành công', movie });
            }
            catch (error) {
                res.status(400).json({ message: error.message || 'Lỗi khi thêm phim' });
            }
        });
    }
    static updateMovie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tmdbId = parseInt(req.params.tmdbId);
                const movieData = req.body;
                const movie = yield movieServices_1.MovieService.updateMovie(tmdbId, movieData);
                res.status(200).json({ message: 'Cập nhật phim thành công', movie });
            }
            catch (error) {
                res.status(error instanceof Error && error.message === 'Không tìm thấy phim' ? 404 : 400).json({
                    message: error.message || 'Lỗi khi cập nhật phim',
                });
            }
        });
    }
    static deleteMovie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tmdbId = parseInt(req.params.tmdbId);
                const movie = yield movieServices_1.MovieService.deleteMovie(tmdbId);
                res.status(200).json({ message: 'Xóa phim thành công', movie });
            }
            catch (error) {
                res.status(error instanceof Error && error.message === 'Không tìm thấy phim' ? 404 : 500).json({
                    message: error.message || 'Lỗi khi xóa phim',
                });
            }
        });
    }
}
exports.MovieController = MovieController;
