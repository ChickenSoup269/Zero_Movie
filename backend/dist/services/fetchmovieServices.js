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
exports.fetchMoviesFromTMDB = fetchMoviesFromTMDB;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const movieModel_1 = require("../models/movieModel");
dotenv_1.default.config();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_UPCOMING_URL = "https://api.themoviedb.org/3/movie/upcoming";
const TMDB_NOW_PLAYING_URL = "https://api.themoviedb.org/3/movie/now_playing";
const MAX_MOVIES = 40;
function fetchFromTMDB(url, page) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield axios_1.default.get(url, {
            params: { api_key: TMDB_API_KEY, language: "vi-VN", page },
        });
        return data.results || [];
    });
}
function fetchMoviesFromTMDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const movieCount = yield movieModel_1.Movie.countDocuments();
            if (movieCount >= MAX_MOVIES) {
                console.log("Database đã có đủ phim, không cần fetch.");
                return;
            }
            let totalFetched = 0;
            const remainingMovies = MAX_MOVIES - movieCount;
            const existingIds = new Set((yield movieModel_1.Movie.find({}, { tmdbId: 1 })).map((m) => m.tmdbId));
            const fetchAndSaveMovies = (url, type) => __awaiter(this, void 0, void 0, function* () {
                let page = 1;
                while (totalFetched < remainingMovies) {
                    const results = yield fetchFromTMDB(url, page);
                    if (results.length === 0)
                        break;
                    const validMovies = results.filter((m) => { var _a; return ((_a = m.overview) === null || _a === void 0 ? void 0 : _a.trim()) !== "" && !existingIds.has(m.id); });
                    const newMovies = validMovies.slice(0, remainingMovies - totalFetched);
                    if (newMovies.length > 0) {
                        const moviesToSave = newMovies.map((m) => ({
                            tmdbId: m.id,
                            title: m.title,
                            originalTitle: m.original_title,
                            originalLanguage: m.original_language,
                            overview: m.overview,
                            releaseDate: m.release_date,
                            posterPath: m.poster_path,
                            backdropPath: m.backdrop_path,
                            popularity: m.popularity,
                            voteAverage: m.vote_average,
                            voteCount: m.vote_count,
                            adult: m.adult,
                            video: m.video,
                            genreIds: m.genre_ids,
                        }));
                        yield movieModel_1.Movie.insertMany(moviesToSave);
                        totalFetched += newMovies.length;
                        for (const movie of newMovies) {
                            existingIds.add(movie.id);
                        }
                        console.log(`Đã lưu ${newMovies.length} phim ${type} từ trang ${page}`);
                    }
                    else {
                        console.log(`Trang ${page} của ${type} không có phim mới.`);
                    }
                    page++;
                    if (results.length < 20)
                        break;
                }
            });
            yield fetchAndSaveMovies(TMDB_UPCOMING_URL, "Upcoming");
            if (totalFetched < remainingMovies) {
                yield fetchAndSaveMovies(TMDB_NOW_PLAYING_URL, "Now Playing");
            }
            console.log(`Hoàn thành! Tổng số phim đã lưu: ${totalFetched}`);
        }
        catch (error) {
            console.error("Lỗi fetch phim từ TMDB:", error);
        }
    });
}
