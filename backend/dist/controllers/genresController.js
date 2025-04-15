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
exports.GenreController = void 0;
const genresService_1 = require("../services/genresService");
class GenreController {
    static getAllGenres(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const genres = yield genresService_1.GenreService.getAllGenres();
                res.status(200).json({ message: 'Lấy danh sách thể loại thành công', genres });
            }
            catch (error) {
                res.status(500).json({ message: error.message || 'Lỗi khi lấy danh sách thể loại' });
            }
        });
    }
    static addGenre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, name } = req.body;
                if (!id || !name) {
                    res.status(400).json({ message: 'Thiếu id hoặc name' });
                    return;
                }
                const genre = yield genresService_1.GenreService.addGenre(id, name);
                res.status(201).json({ message: 'Thêm thể loại thành công', genre });
            }
            catch (error) {
                res.status(400).json({ message: error.message || 'Lỗi khi thêm thể loại' });
            }
        });
    }
    static updateGenre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const { name } = req.body;
                if (!name) {
                    res.status(400).json({ message: 'Thiếu name' });
                    return;
                }
                const genre = yield genresService_1.GenreService.updateGenre(id, name);
                res.status(200).json({ message: 'Cập nhật thể loại thành công', genre });
            }
            catch (error) {
                res.status(error instanceof Error && error.message.includes('Không tìm thấy') ? 404 : 400).json({
                    message: error.message || 'Lỗi khi cập nhật thể loại',
                });
            }
        });
    }
    static deleteGenre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const genre = yield genresService_1.GenreService.deleteGenre(id);
                res.status(200).json({ message: 'Xóa thể loại thành công', genre });
            }
            catch (error) {
                res.status(error instanceof Error && error.message.includes('Không tìm thấy') ? 404 : 500).json({
                    message: error.message || 'Lỗi khi xóa thể loại',
                });
            }
        });
    }
    static searchGenres(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { q } = req.query;
                if (!q || typeof q !== 'string') {
                    res.status(400).json({ message: 'Thiếu query tìm kiếm' });
                    return;
                }
                const genres = yield genresService_1.GenreService.searchGenres(q);
                res.status(200).json({ message: 'Tìm kiếm thể loại thành công', genres });
            }
            catch (error) {
                res.status(500).json({ message: error.message || 'Lỗi khi tìm kiếm thể loại' });
            }
        });
    }
    static getMoviesByGenre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { genreName } = req.params;
                const movies = yield genresService_1.GenreService.getMoviesByGenre(genreName);
                res.status(200).json({ message: 'Lấy danh sách phim theo thể loại thành công', movies });
            }
            catch (error) {
                res.status(error instanceof Error && error.message.includes('Không tìm thấy') ? 404 : 500).json({
                    message: error.message || 'Lỗi khi lấy phim theo thể loại',
                });
            }
        });
    }
}
exports.GenreController = GenreController;
