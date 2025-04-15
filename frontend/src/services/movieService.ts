/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

interface Movie {
  _id: string
  tmdbId: number
  title: string
  originalTitle: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  genreIds: number[]
  releaseDate: string
  voteAverage: number
  voteCount: number
  popularity: number
  originalLanguage: string
  adult: boolean
  video: boolean
  status?: "upcoming" | "nowPlaying"
  createdAt: string
  updatedAt: string
  __v: number
}

interface MovieInput {
  tmdbId?: number
  title: string
  originalTitle?: string
  overview?: string
  posterPath?: string | null
  backdropPath?: string | null
  genreIds?: number[]
  releaseDate?: string
  voteAverage?: number
  voteCount?: number
  popularity?: number
  originalLanguage?: string
  adult?: boolean
  video?: boolean
  status?: "upcoming" | "nowPlaying"
}

export class MovieService {
  // Lấy tất cả phim
  static async getAllMovies(): Promise<Movie[]> {
    try {
      const response = await axios.get(`${API_URL}/movies`)
      return response.data.movies || response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch movies")
    }
  }

  // Lấy phim theo ID
  static async getMovieById(id: string): Promise<Movie> {
    try {
      const response = await axios.get(`${API_URL}/movies/${id}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch movie")
    }
  }

  // Tìm kiếm phim theo tiêu đề
  static async searchMovies(title: string): Promise<Movie[]> {
    try {
      const response = await axios.get(`${API_URL}/movies/search/${title}`)
      return response.data.movies || response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to search movies"
      )
    }
  }

  // Thêm phim mới
  static async addMovie(movie: MovieInput): Promise<Movie> {
    try {
      const response = await axios.post(`${API_URL}/movies`, movie)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to add movie")
    }
  }

  // Cập nhật phim
  static async updateMovie(id: string, movie: MovieInput): Promise<Movie> {
    try {
      const response = await axios.put(`${API_URL}/movies/${id}`, movie)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update movie")
    }
  }

  // Xóa phim
  static async deleteMovie(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/movies/${id}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete movie")
    }
  }
}
