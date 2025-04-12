/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

export interface IGenre {
  id: number
  name: string
}

export class GenreService {
  static async getAllGenres(): Promise<IGenre[]> {
    try {
      const response = await axios.get(`${API_URL}/genres`)
      console.log("Genres API response:", response.data)
      if (!response.data || !Array.isArray(response.data.genres)) {
        console.error("Genres response is not an array:", response.data)
        return []
      }
      // Ánh xạ và loại bỏ từ "Phim" khỏi name
      const genres: IGenre[] = response.data.genres.map((genre: any) => ({
        id: genre.id,
        name: genre.name.replace(/^Phim\s+/i, "").trim(), // Loại bỏ "Phim" ở đầu, không phân biệt hoa thường
      }))
      console.log("Processed genres:", genres)
      return genres
    } catch (error: any) {
      console.error("Error fetching genres:", error.message)
      return []
    }
  }

  static async getGenreMap(): Promise<{ [key: number]: string }> {
    try {
      const genres = await this.getAllGenres()
      console.log("Genres for map:", genres)
      if (!Array.isArray(genres)) {
        console.error("Genres is not an array:", genres)
        return {}
      }
      return genres.reduce((map, genre) => {
        if (typeof genre.id === "number" && typeof genre.name === "string") {
          map[genre.id] = genre.name
        }
        return map
      }, {} as { [key: number]: string })
    } catch (error: any) {
      console.error("Error creating genre map:", error.message)
      return {}
    }
  }

  static async searchGenres(keyword: string): Promise<IGenre[]> {
    try {
      const response = await axios.get(`${API_URL}/genres/search`, {
        params: { keyword },
      })
      console.log("Search genres response:", response.data)
      if (!response.data || !Array.isArray(response.data.genres)) {
        console.error("Search genres response is not an array:", response.data)
        return []
      }
      // Ánh xạ và loại bỏ từ "Phim"
      const genres: IGenre[] = response.data.genres.map((genre: any) => ({
        id: genre.id,
        name: genre.name.replace(/^Phim\s+/i, "").trim(),
      }))
      console.log("Processed search genres:", genres)
      return genres
    } catch (error: any) {
      console.error("Error searching genres:", error.message)
      return []
    }
  }

  static async getMoviesByGenre(genreName: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${API_URL}/genres/movies/${encodeURIComponent(genreName)}`
      )
      console.log("Movies by genre response:", response.data)
      if (!Array.isArray(response.data)) {
        console.error(
          "Movies by genre response is not an array:",
          response.data
        )
        return []
      }
      return response.data
    } catch (error: any) {
      console.error("Error fetching movies by genre:", error.message)
      return []
    }
  }
}
