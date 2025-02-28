import axios from "axios";
import Movie, { IMovie } from "../../models/movies/Movie";
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
    const tmdbMovies = response.data.results as Partial<IMovie>[];

    // Điều chỉnh dữ liệu để khớp với IMovie
    const moviesToSave = tmdbMovies.map((movie: Partial<IMovie>) => {
      const adjustedMovie: IMovie = {
        ...movie,
        id: Number(movie.id || 0),
        adult: movie.adult || false,
        budget: movie.budget || 0,
        revenue: movie.revenue || 0,
        runtime: movie.runtime || 0,
        vote_average: movie.vote_average || 0,
        vote_count: movie.vote_count || 0,
        // Thêm các trường khác nếu cần (ví dụ: title, overview, v.v.)
        title: movie.title || "No title",
        overview: movie.overview || "",
      } as IMovie;
      return adjustedMovie;
    });

    await Movie.insertMany(moviesToSave);
    return moviesToSave as IMovie[];
  } catch (error) {
    throw new Error(`Lỗi khi fetch phim từ TMDB: ${(error as Error).message}`);
  }
};

// Lấy phim theo ID
export const getMovieById = async (id: string): Promise<IMovie> => {
  const numericId = Number(id) || id;
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
    const movieData = response.data as Partial<IMovie>;

    // Điều chỉnh dữ liệu để khớp với IMovie
    const adjustedMovieData: IMovie = {
      ...movieData,
      id: Number(movieData.id || 0),
      adult: movieData.adult || false,
      budget: movieData.budget || 0,
      revenue: movieData.revenue || 0,
      runtime: movieData.runtime || 0,
      vote_average: movieData.vote_average || 0,
      vote_count: movieData.vote_count || 0,
      title: movieData.title || "No title",
      overview: movieData.overview || "",
    } as IMovie;

    const newMovie = new Movie(adjustedMovieData);
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
  if (!movieData.id || !movieData.title) {
    throw new Error("ID và title là bắt buộc");
  }
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
    { ...updateData, id: numericId }, // Bảo vệ id không bị ghi đè
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
