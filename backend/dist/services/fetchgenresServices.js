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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAndStoreGenres = fetchAndStoreGenres;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const genresModel_1 = require("../models/genresModel");
const movieModel_1 = require("../models/movieModel");
dotenv_1.default.config();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_GENRES_URL = "https://api.themoviedb.org/3/genre/movie/list";
function fetchAndStoreGenres() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Kiểm tra nếu đã có genres trong database
            const existingGenres = yield genresModel_1.Genre.countDocuments();
            const movieGenreIds = yield movieModel_1.Movie.distinct("genreIds");
            if (existingGenres >= movieGenreIds.length) {
                console.log("Database đã có đủ genres dựa trên movies, không cần fetch.");
                return;
            }
            console.log("Fetching genres from TMDB...");
            const { data } = yield axios_1.default.get(TMDB_GENRES_URL, {
                params: { api_key: TMDB_API_KEY, language: "vi-VN" },
            });
            if (!data.genres || data.genres.length === 0) {
                console.log("Không có genres nào từ API.");
                return;
            }
            // Lọc genres chỉ giữ lại những id có trong movies
            const filteredGenres = data.genres.filter((g) => movieGenreIds.includes(g.id));
            if (!filteredGenres.length) {
                console.log("Không có genres nào khớp với movies.");
                return;
            }
            // Lưu genres, bỏ qua nếu đã tồn tại
            yield genresModel_1.Genre.insertMany(filteredGenres, { ordered: false })
                .then(() => console.log(`Đã lưu ${filteredGenres.length} genres.`))
                .catch((error) => {
                if (error.code === 11000) { // Duplicate key error
                    console.log("Một số genres đã tồn tại, bỏ qua lỗi trùng lặp.");
                }
                else {
                    throw error; // Ném lỗi khác nếu không phải trùng lặp
                }
            });
        }
        catch (error) {
            console.error("Lỗi khi fetch genres:", error);
        }
    });
}
