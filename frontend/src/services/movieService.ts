/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

// Định nghĩa interface Movie dựa trên IMovie từ backend
export interface Movie {
  _id: string
  tmdbId: number
  title: string
  originalTitle: string
  originalLanguage: string
  overview: string
  releaseDate?: string
  posterPath?: string | null
  backdropPath?: string | null
  popularity?: number
  voteAverage?: number
  voteCount?: number
  adult?: boolean
  video?: boolean
  genreIds: number[]
  status?: "upcoming" | "nowPlaying" | "discontinued"
  activePeriod?: {
    start: string
    end: string
  }
  createdAt: string
  updatedAt: string
  ageRating?: string
  runtime?: number
  director?: string
  writers?: string[]
  starring?: string
  genreNames?: string[]
  __v?: number
}

// Định nghĩa interface cho input khi thêm/cập nhật phim
export interface MovieInput {
  tmdbId?: number | null
  title: string
  originalTitle?: string
  originalLanguage?: string
  overview?: string
  releaseDate?: string
  posterPath?: string | null
  backdropPath?: string | null
  popularity?: number
  voteAverage?: number
  voteCount?: number
  adult?: boolean
  video?: boolean
  genreIds?: number[]
  status?: "upcoming" | "nowPlaying" | "discontinued"
  activePeriod?: {
    start: string
    end: string
  }
  ageRating?: string
  runtime?: number
  director?: string
  writers?: string[]
  starring?: string
}

export class MovieService {
  // Lấy tất cả phim
  static async getAllMovies(): Promise<Movie[]> {
    try {
      const response = await axios.get(`${API_URL}/movies`)
      return response.data.movies || response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy danh sách phim"
      )
    }
  }

  // Lấy phim theo tmdbId
  static async getMovieByTmdbId(tmdbId: number): Promise<Movie> {
    try {
      const response = await axios.get(`${API_URL}/movies/${tmdbId}`)
      if (!response.data?.movie) {
        throw new Error("Phim không tồn tại trong cơ sở dữ liệu")
      }
      return response.data.movie
    } catch (error: any) {
      console.error("Lỗi khi lấy phim theo tmdbId:", {
        tmdbId,
        status: error.response?.status,
        data: error.response?.data,
      })
      const message =
        error.response?.status === 404
          ? "Không tìm thấy phim"
          : error.response?.data?.message || "Lỗi khi lấy thông tin phim"
      throw new Error(message)
    }
  }

  // Tìm kiếm phim theo tiêu đề
  static async searchMovies(title: string): Promise<Movie[]> {
    try {
      if (!title || title.trim() === "") {
        throw new Error("Từ khóa tìm kiếm không được để trống")
      }
      const response = await axios.get(
        `${API_URL}/movies/search?title=${encodeURIComponent(title)}`
      )
      const movies = response.data.movies || []
      return movies.filter((movie: Movie) => {
        if (!movie.tmdbId) {
          console.warn(`Bỏ qua phim không có tmdbId: ${movie.title}`)
          return false
        }
        return true
      })
    } catch (error: any) {
      console.error("Lỗi khi tìm kiếm phim:", {
        query: title,
        status: error.response?.status,
        data: error.response?.data,
      })
      throw new Error(
        error.response?.data?.message || "Không thể tìm kiếm phim"
      )
    }
  }

  // Thêm phim mới
  static async addMovie(movie: MovieInput): Promise<Movie> {
    try {
      const response = await axios.post(`${API_URL}/movies`, movie)
      return response.data.movie || response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Không thể thêm phim mới"
      )
    }
  }

  // Cập nhật phim theo tmdbId
  static async updateMovie(tmdbId: number, movie: MovieInput): Promise<Movie> {
    try {
      const response = await axios.put(`${API_URL}/movies/${tmdbId}`, movie)
      if (!response.data?.movie) {
        throw new Error("Phim không tồn tại trong cơ sở dữ liệu")
      }
      return response.data.movie
    } catch (error: any) {
      console.error("Lỗi khi cập nhật phim:", {
        tmdbId,
        status: error.response?.status,
        data: error.response?.data,
      })
      const message =
        error.response?.status === 404
          ? "Không tìm thấy phim"
          : error.response?.data?.message || "Lỗi khi cập nhật phim"
      throw new Error(message)
    }
  }

  // Xóa phim theo tmdbId
  static async deleteMovie(tmdbId: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/movies/${tmdbId}`)
    } catch (error: any) {
      console.error("Lỗi khi xóa phim:", {
        tmdbId,
        status: error.response?.status,
        data: error.response?.data,
      })
      const message =
        error.response?.status === 404
          ? "Không tìm thấy phim"
          : error.response?.data?.message || "Lỗi khi xóa phim"
      throw new Error(message)
    }
  }

  // Lấy gợi ý phim theo userId
  static async getRecommendations(userId: string): Promise<Movie[]> {
    try {
      console.log('Calling API:', `${API_URL}/movies/recommend/${userId}`);
      const response = await axios.get(`${API_URL}/movies/recommend/${userId}`, { timeout: 20000 });
      return response.data.recommendations || []
    } catch (error: any) {
      console.error("Lỗi khi lấy gợi ý phim:", {
        userId,
        status: error.response?.status,
        data: error.response?.data,
      })
      throw new Error(
        error.response?.data?.message || "Không thể lấy gợi ý phim"
      )
    }
  }
}
