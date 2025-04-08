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
exports.GenreService = void 0;
const genresModel_1 = require("../models/genresModel");
const movieModel_1 = require("../models/movieModel");
class GenreService {
    // [GET] all
    static getAllGenres() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield genresModel_1.Genre.find();
            }
            catch (error) {
                throw new Error("Lỗi khi lấy danh sách thể loại");
            }
        });
    }
    // [POST] 
    static addGenre(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingGenre = yield genresModel_1.Genre.findOne({ id });
                if (existingGenre) {
                    throw new Error(`Thể loại với ID ${id} đã tồn tại`);
                }
                return yield genresModel_1.Genre.create({ id, name });
            }
            catch (error) {
                throw error instanceof Error ? error : new Error("Lỗi khi thêm thể loại");
            }
        });
    }
    // [UPDATE]
    static updateGenre(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedGenre = yield genresModel_1.Genre.findOneAndUpdate({ id }, { name }, { new: true });
                if (!updatedGenre) {
                    throw new Error(`Không tìm thấy thể loại với ID ${id}`);
                }
                return updatedGenre;
            }
            catch (error) {
                throw error instanceof Error ? error : new Error("Lỗi khi cập nhật thể loại");
            }
        });
    }
    // [DELETE]
    static deleteGenre(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedGenre = yield genresModel_1.Genre.findOneAndDelete({ id });
                if (!deletedGenre) {
                    throw new Error(`Không tìm thấy thể loại với ID ${id}`);
                }
                return deletedGenre;
            }
            catch (error) {
                throw new Error("Lỗi khi xóa thể loại");
            }
        });
    }
    // [Search]
    static searchGenres(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield genresModel_1.Genre.find({ name: new RegExp(keyword, "i") });
            }
            catch (error) {
                throw new Error("Lỗi khi tìm kiếm thể loại");
            }
        });
    }
    // [GetMoviebyGenre]
    static getMoviesByGenre(genreName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const genre = yield genresModel_1.Genre.findOne({ name: new RegExp(`^${genreName}$`, "i") });
                if (!genre) {
                    throw new Error(`Không tìm thấy thể loại: ${genreName}`);
                }
                const movies = yield movieModel_1.Movie.find({ genreIds: genre.id });
                return movies;
            }
            catch (error) {
                throw error instanceof Error ? error : new Error("Lỗi khi lấy phim theo thể loại");
            }
        });
    }
}
exports.GenreService = GenreService;
