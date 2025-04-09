import axios from "axios";
import dotenv from "dotenv";
import {Genre} from "../models/genresModel";
import {Movie} from "../models/movieModel";

dotenv.config();  

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_GENRES_URL = "https://api.themoviedb.org/3/genre/movie/list";

export async function fetchAndStoreGenres() {
  try {
    // Kiểm tra nếu đã có genres trong database
    const existingGenres = await Genre.countDocuments();
    const movieGenreIds = await Movie.distinct("genreIds");
    if (existingGenres >= movieGenreIds.length) {
      console.log("Database đã có đủ genres dựa trên movies, không cần fetch.");
      return;
    }

    console.log("Fetching genres from TMDB...");
    const { data } = await axios.get(TMDB_GENRES_URL, {
      params: { api_key: TMDB_API_KEY, language: "vi-VN" },
    });

    if (!data.genres || data.genres.length === 0) {
      console.log("Không có genres nào từ API.");
      return;
    }

    // Lọc genres chỉ giữ lại những id có trong movies
    const filteredGenres = data.genres.filter((g: { id: number }) =>
      movieGenreIds.includes(g.id)
    );

    if (!filteredGenres.length) {
      console.log("Không có genres nào khớp với movies.");
      return;
    }

    // Lưu genres, bỏ qua nếu đã tồn tại
    await Genre.insertMany(filteredGenres, { ordered: false })
      .then(() => console.log(`Đã lưu ${filteredGenres.length} genres.`))
      .catch((error) => {
        if (error.code === 11000) { // Duplicate key error
          console.log("Một số genres đã tồn tại, bỏ qua lỗi trùng lặp.");
        } else {
          throw error; // Ném lỗi khác nếu không phải trùng lặp
        }
      });
  } catch (error) {
    console.error("Lỗi khi fetch genres:", error);
  }
}