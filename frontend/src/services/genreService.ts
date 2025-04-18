/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

export interface Genre {
  id: number
  name: string
}

export interface Movie {
  ageRating: string
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
  runtime?: number
  director?: string
  writers?: string[]
  starring?: string
}

export class GenreService {
  static async getGenres(): Promise<Genre[]> {
    try {
      const response = await axios.get(`${API_URL}/genres`)
      const data = response.data
      // Handle both array and wrapped responses
      const genres = Array.isArray(data) ? data : data.genres || []
      if (!Array.isArray(genres)) {
        throw new Error("Invalid response format: Expected an array of genres")
      }

      return genres
    } catch (error: any) {
      console.error("Failed to fetch genres:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: `${API_URL}/genres`,
      })
      throw new Error(error.response?.data?.message || "Failed to fetch genres")
    }
  }

  static async addGenre(name: string): Promise<Genre> {
    try {
      const response = await axios.post(`${API_URL}/genres`, { name })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to add genre")
    }
  }

  static async updateGenre(id: string, name: string): Promise<Genre> {
    try {
      const response = await axios.put(`${API_URL}/genres/${id}`, { name })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update genre")
    }
  }

  static async deleteGenre(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/genres/${id}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete genre")
    }
  }

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

  static async getGenreMap(): Promise<Record<number, string>> {
    try {
      const genres = await this.getGenres()
      const genreMap: Record<number, string> = {}
      genres.forEach((genre) => {
        genreMap[genre.id] = genre.name.replace(/^Phim\s+/i, "").trim()
      })
      return genreMap
    } catch (error: any) {
      console.error("Failed to fetch genre map:", error)
      throw new Error(
        error.response?.data?.message || "Failed to fetch genre map"
      )
    }
  }
}
