import axios from "axios";
import Movie, { IMovie } from "../models/movies/Movie";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Lấy tất cả phim
export const getAllMovies = async (): Promise<IMovie[]> => {
  const existingMovies = await Movie.find();
  if (existingMovies.length > 0) {
    return existingMovies;
  }

  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
        language: "vi-VN",
        page: 1,
      },
    });
    const tmdbMovies = response.data.results as IMovie[];

    await Movie.insertMany(tmdbMovies);
    return tmdbMovies;
  } catch (error) {
    throw new Error(`Lỗi khi fetch phim từ TMDB: ${(error as Error).message}`);
  }
};

// Lấy phim theo ID
export const getMovieById = async (id: string): Promise<IMovie> => {
  const numericId = Number(id) || id; // Xử lý cả số và chuỗi
  const existingMovie = await Movie.findOne({ id: numericId });
  if (existingMovie) {
    return existingMovie;
  }

  try {
    const response = await axios.get(`${BASE_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        language: "vi-VN",
      },
    });
    const movieData = response.data as IMovie;

    const newMovie = new Movie(movieData);
    await newMovie.save();
    return newMovie;
  } catch (error) {
    throw new Error(
      `Lỗi khi fetch phim theo ID từ TMDB: ${(error as Error).message}`
    );
  }
};

// Tạo phim mới (từ dữ liệu người dùng nhập)
export const createMovie = async (movieData: IMovie): Promise<IMovie> => {
  const newMovie = new Movie(movieData);
  return await newMovie.save();
};

// Cập nhật phim theo ID
export const updateMovie = async (
  id: string,
  updateData: Partial<IMovie>
): Promise<IMovie> => {
  const numericId = Number(id) || id;
  const updatedMovie = await Movie.findOneAndUpdate(
    { id: numericId },
    { ...updateData },
    { new: true, runValidators: true }
  );
  if (!updatedMovie) {
    throw new Error("Không tìm thấy phim để cập nhật");
  }
  return updatedMovie;
};

// Xóa phim theo ID
export const deleteMovie = async (id: string): Promise<void> => {
  const numericId = Number(id) || id;
  const deletedMovie = await Movie.findOneAndDelete({ id: numericId });
  if (!deletedMovie) {
    throw new Error("Không tìm thấy phim để xóa");
  }
};
