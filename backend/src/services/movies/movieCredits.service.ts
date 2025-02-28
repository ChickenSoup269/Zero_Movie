import axios from "axios";
import MovieCredits, { IMovieCredits } from "../../models/movies/MovieCredits";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Lấy danh sách credits (diễn viên và ê-kíp) theo ID phim
export const getMovieCredits = async (id: string): Promise<IMovieCredits> => {
  const numericId = Number(id) || id;
  const existingCredits = await MovieCredits.findOne({ id: numericId });
  if (existingCredits) {
    return existingCredits;
  }

  try {
    const response = await axios.get(`${BASE_URL}/movie/${id}/credits`, {
      params: {
        api_key: API_KEY,
        language: "vi-VN",
      },
    });
    const creditsData = response.data as Partial<IMovieCredits>;

    const adjustedCreditsData: IMovieCredits = {
      ...creditsData,
      id: Number(creditsData.id || 0),
      cast: creditsData.cast || [],
      crew: creditsData.crew || [],
    } as IMovieCredits;

    const newCredits = new MovieCredits(adjustedCreditsData);
    await newCredits.save();
    return newCredits;
  } catch (error) {
    throw new Error(
      `Lỗi khi fetch credits phim từ TMDB: ${(error as Error).message}`
    );
  }
};
