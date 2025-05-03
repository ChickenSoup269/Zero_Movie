import { Movie, IMovie } from "../models/movieModel"

export class MovieService {
  static async getAllMovies(): Promise<IMovie[]> {
    try {
      return await Movie.find()
    } catch (error) {
      throw new Error("Lỗi khi lấy danh sách phim")
    }
  }

  static async getMovieById(tmdbId: number): Promise<IMovie> {
    try {
      const movie = await Movie.findOne({ tmdbId })
      if (!movie) throw new Error("Không tìm thấy phim")
      return movie
    } catch (error) {
      throw error instanceof Error ? error : new Error("Lỗi khi lấy phim")
    }
  }

  static async searchMoviesByTitle(keyword: string): Promise<IMovie[]> {
    try {
      if (!keyword || keyword.trim() === "") {
        throw new Error("Từ khóa tìm kiếm không được để trống")
      }
      return await Movie.find({
        title: { $regex: keyword, $options: "i" }, // Tìm kiếm không phân biệt hoa thường
      })
    } catch (error) {
      throw error instanceof Error ? error : new Error("Lỗi khi tìm kiếm phim")
    }
  }

  static async addMovie(movieData: Partial<IMovie>): Promise<IMovie> {
    try {
      const newMovie = new Movie(movieData)
      return await newMovie.save()
    } catch (error) {
      throw new Error("Lỗi khi thêm phim")
    }
  }

  static async updateMovie(
    tmdbId: number,
    movieData: Partial<IMovie>
  ): Promise<IMovie> {
    try {
      const updatedMovie = await Movie.findOneAndUpdate({ tmdbId }, movieData, {
        new: true,
      })
      if (!updatedMovie) throw new Error("Không tìm thấy phim")
      return updatedMovie
    } catch (error) {
      throw error instanceof Error ? error : new Error("Lỗi khi cập nhật phim")
    }
  }

  static async deleteMovie(tmdbId: number): Promise<IMovie> {
    try {
      const deletedMovie = await Movie.findOneAndDelete({ tmdbId })
      if (!deletedMovie) throw new Error("Không tìm thấy phim")
      return deletedMovie
    } catch (error) {
      throw new Error("Lỗi khi xóa phim")
    }
  }
}
