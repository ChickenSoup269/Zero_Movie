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
exports.getGenres = getGenres;
exports.addGenre = addGenre;
exports.updateGenre = updateGenre;
exports.deleteGenre = deleteGenre;
exports.searchGenre = searchGenre;
exports.getMoviesByGenre = getMoviesByGenre;
const genresService_1 = require("../services/genresService");
function getGenres(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const genres = yield genresService_1.GenreService.getAllGenres();
            res.status(200).json(genres);
        }
        catch (error) {
            res.status(500).json({ message: error.message || "Lỗi server" });
        }
    });
}
function addGenre(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id, name } = req.body;
            const genre = yield genresService_1.GenreService.addGenre(id, name);
            res.status(201).json(genre);
        }
        catch (error) {
            res.status(500).json({ message: error.message || "Lỗi server" });
        }
    });
}
function updateGenre(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const { name } = req.body;
            const updatedGenre = yield genresService_1.GenreService.updateGenre(id, name);
            res.status(200).json(updatedGenre);
        }
        catch (error) {
            const message = error.message || "Lỗi server";
            res.status(message.includes("Không tìm thấy") ? 404 : 500).json({ message });
        }
    });
}
function deleteGenre(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const deletedGenre = yield genresService_1.GenreService.deleteGenre(id);
            res.status(200).json({ message: "Đã xóa thể loại thành công", deletedGenre });
        }
        catch (error) {
            const message = error.message || "Lỗi server";
            res.status(message.includes("Không tìm thấy") ? 404 : 500).json({ message });
        }
    });
}
function searchGenre(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { keyword } = req.query;
            const genres = yield genresService_1.GenreService.searchGenres(keyword);
            res.status(200).json(genres.length ? genres : { message: "Không tìm thấy thể loại nào phù hợp" });
        }
        catch (error) {
            res.status(500).json({ message: error.message || "Lỗi server" });
        }
    });
}
function getMoviesByGenre(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { genreName } = req.params;
            const movies = yield genresService_1.GenreService.getMoviesByGenre(genreName);
            res.status(200).json(movies.length ? movies : { message: `Không có phim nào thuộc thể loại: ${genreName}` });
        }
        catch (error) {
            const message = error.message || "Lỗi server";
            res.status(message.includes("Không tìm thấy") ? 404 : 500).json({ message });
        }
    });
}
