import axios from "axios";
import dotenv from "dotenv";
import {Movie} from "../models/movieModel";

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_UPCOMING_URL = "https://api.themoviedb.org/3/movie/upcoming";
const TMDB_NOW_PLAYING_URL = "https://api.themoviedb.org/3/movie/now_playing";
const MAX_MOVIES = 40;

async function fetchFromTMDB(url: string, page: number) {
  const { data } = await axios.get(url, {
    params: { api_key: TMDB_API_KEY, language: "vi-VN", page },
  });
  return data.results || [];
}

export async function fetchMoviesFromTMDB() {
  try {
    const movieCount = await Movie.countDocuments();
    if (movieCount >= MAX_MOVIES) {
      console.log("Database đã có đủ phim, không cần fetch.");
      return;
    }

    let totalFetched = 0;
    const remainingMovies = MAX_MOVIES - movieCount;

    const existingIds = new Set(
      (await Movie.find({}, { tmdbId: 1 })).map((m) => m.tmdbId)
    );

    const fetchAndSaveMovies = async (url: string, type: string) => {
      let page = 1;
      while (totalFetched < remainingMovies) {
        const results = await fetchFromTMDB(url, page);
        if (results.length === 0) break;

        const validMovies = results.filter(
          (m: any) => m.overview?.trim() !== "" && !existingIds.has(m.id)
        );

        const newMovies = validMovies.slice(0, remainingMovies - totalFetched);

        if (newMovies.length > 0) {
          const moviesToSave = newMovies.map((m: any) => ({
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

          await Movie.insertMany(moviesToSave);
          totalFetched += newMovies.length;
          
          for (const movie of newMovies) {
            existingIds.add(movie.id);
          }

          console.log(`Đã lưu ${newMovies.length} phim ${type} từ trang ${page}`);
        } else {
          console.log(`Trang ${page} của ${type} không có phim mới.`);
        }

        page++;
        if (results.length < 20) break;
      }
    };

    await fetchAndSaveMovies(TMDB_UPCOMING_URL, "Upcoming");
    if (totalFetched < remainingMovies) {
      await fetchAndSaveMovies(TMDB_NOW_PLAYING_URL, "Now Playing");
    }

    console.log(`Hoàn thành! Tổng số phim đã lưu: ${totalFetched}`);
  } catch (error) {
    console.error("Lỗi fetch phim từ TMDB:", error);
  }
}