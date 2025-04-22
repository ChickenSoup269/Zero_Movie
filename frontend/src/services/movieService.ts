/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file");
}

export interface Movie {
  id: number;
  genreNames: string[];
  ageRating: string;
  _id: string;
  tmdbId: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  genreIds: number[];
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  originalLanguage: string;
  adult: boolean;
  video: boolean;
  status?: "upcoming" | "nowPlaying";
  createdAt: string;
  updatedAt: string;
  __v: number;
  runtime?: number;
  director?: string;
  writers?: string[];
  starring?: string;
}

export interface MovieInput {
  ageRating: string;
  tmdbId?: number;
  title: string;
  originalTitle?: string;
  overview?: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  genreIds?: number[];
  releaseDate?: string;
  voteAverage?: number;
  voteCount?: number;
  popularity?: number;
  originalLanguage?: string;
  adult?: boolean;
  video?: boolean;
  status?: "upcoming" | "nowPlaying";
  runtime?: number;
  director?: string;
  writers?: string[];
  starring?: string;
}

export class MovieService {
  static async getAllMovies(): Promise<Movie[]> {
    try {
      const response = await axios.get(`${API_URL}/movies`);
      return response.data.movies || response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch movies"
      );
    }
  }

  static async getMovieById(id: string): Promise<Movie> {
    try {
      const response = await axios.get(`${API_URL}/movies/${id}`);
      if (!response.data) {
        throw new Error("Phim không tồn tại trong database");
      }
      return response.data;
    } catch (error: any) {
      console.error("Error fetching movie:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.response?.data?.message || "Không tìm thấy phim");
    }
  }

  static async getMovieByTmdbId(tmdbId: string): Promise<Movie> {
    try {
      console.log(`Fetching movie with tmdbId: ${tmdbId}`);
      const response = await axios.get(`${API_URL}/movies/${tmdbId}`);
      if (!response.data || !response.data.movie) {
        throw new Error("Phim không tồn tại trong database");
      }
      console.log("API response:", response.data);
      return response.data.movie; // Backend trả về { message, movie }
    } catch (error: any) {
      console.error("Error fetching movie by tmdbId:", {
        tmdbId,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.response?.data?.message || "Không tìm thấy phim");
    }
  }

  static async searchMovies(title: string): Promise<Movie[]> {
    try {
      const response = await axios.get(`${API_URL}/movies/search`, {
        params: { q: title },
      });
      return response.data.movies || response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to search movies"
      );
    }
  }

  static async addMovie(movie: MovieInput): Promise<Movie> {
    try {
      const response = await axios.post(`${API_URL}/movies`, movie);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to add movie");
    }
  }

  static async updateMovie(id: string, movie: MovieInput): Promise<Movie> {
    try {
      const response = await axios.put(`${API_URL}/movies/${id}`, movie);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update movie"
      );
    }
  }

  static async deleteMovie(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/movies/${id}`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete movie"
      );
    }
  }

  static async getRecommendations(userId: string): Promise<Movie[]> {
    try {
      const response = await axios.get(`${API_URL}/movies/recommend/${userId}`);
      return response.data.recommendations;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch recommendations"
      );
    }
  }
}
