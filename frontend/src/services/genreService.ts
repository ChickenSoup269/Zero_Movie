/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

interface Genre {
  id: number
  name: string
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

export class GenreService {
  // Lấy danh sách tất cả thể loại
  static async getGenres(): Promise<Genre[]> {
    try {
      const response = await axios.get(`${API_URL}/genres`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch genres")
    }
  }

  // Thêm thể loại mới
  static async addGenre(name: string): Promise<Genre> {
    try {
      const response = await axios.post(`${API_URL}/genres`, { name })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to add genre")
    }
  }

  // Cập nhật thể loại
  static async updateGenre(id: string, name: string): Promise<Genre> {
    try {
      const response = await axios.put(`${API_URL}/genres/${id}`, { name })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update genre")
    }
  }

  // Xóa thể loại
  static async deleteGenre(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/genres/${id}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete genre")
    }
  }

  // Tìm kiếm thể loại
  static async searchGenre(query: string): Promise<Genre[]> {
    try {
      const response = await axios.get(`${API_URL}/genres/search`, {
        params: { q: query },
      })
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to search genres"
      )
    }
  }

  // Lấy phim theo tên thể loại
  static async getMoviesByGenre(genreName: string): Promise<Movie[]> {
    try {
      const response = await axios.get(`${API_URL}/genres/${genreName}/movies`)
      return response.data.movies || response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch movies by genre"
      )
    }
  }

  // Giữ nguyên getGenreMap hiện tại (giả sử nó ánh xạ genreId sang tên)
  static async getGenreMap(): Promise<Record<number, string>> {
    try {
      const genres = await this.getGenres()
      const genreMap: Record<number, string> = {}
      genres.forEach((genre) => {
        // Ánh xạ genre.id sang tên thể loại, loại bỏ "Phim" ở đầu
        return (genreMap[genre.id] = genre.name.replace(/^Phim\s+/i, "").trim())
      })
      return genreMap
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch genre map"
      )
    }
  }
}
