import axios from "axios";
import MovieDetails, { IMovieDetails } from "../../models/movies/MovieDetails";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Lấy chi tiết phim theo ID
export const getMovieDetails = async (id: string): Promise<IMovieDetails> => {
  const numericId = Number(id) || id;
  const existingDetails = await MovieDetails.findOne({ id: numericId });
  if (existingDetails) {
    return existingDetails;
  }

  try {
    const response = await axios.get(`${BASE_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        language: "vi-VN",
      },
    });
    const movieData = response.data as Partial<IMovieDetails>;

    const adjustedMovieData: IMovieDetails = {
      ...movieData,
      id: Number(movieData.id || 0),
      adult: movieData.adult || false,
      budget: movieData.budget || 0,
      revenue: movieData.revenue || 0,
      runtime: movieData.runtime || 0,
      vote_average: movieData.vote_average || 0,
      vote_count: movieData.vote_count || 0,
    } as IMovieDetails;

    const newDetails = new MovieDetails(adjustedMovieData);
    await newDetails.save();
    return newDetails;
  } catch (error) {
    throw new Error(
      `Lỗi khi fetch chi tiết phim từ TMDB: ${(error as Error).message}`
    );
  }
};
