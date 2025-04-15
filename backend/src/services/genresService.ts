import { Genre } from "../models/genresModel";
import { Movie } from "../models/movieModel";

export class GenreService {
  // [GET] all
  static async getAllGenres(): Promise<any[]> {
    try {
      return await Genre.find();
    } catch (error) {
      throw new Error("Lỗi khi lấy danh sách thể loại");
    }
  }

  // [POST] 
  static async addGenre(id: number, name: string): Promise<any> {
    try {
      const existingGenre = await Genre.findOne({ id });
      if (existingGenre) {
        throw new Error(`Thể loại với ID ${id} đã tồn tại`);
      }
      return await Genre.create({ id, name });
    } catch (error) {
      throw error instanceof Error ? error : new Error("Lỗi khi thêm thể loại");
    }
  }

  // [UPDATE]
  static async updateGenre(id: number, name: string): Promise<any> {
    try {
      const updatedGenre = await Genre.findOneAndUpdate(
        { id },
        { name },
        { new: true }
      );
      if (!updatedGenre) {
        throw new Error(`Không tìm thấy thể loại với ID ${id}`);
      }
      return updatedGenre;
    } catch (error) {
      throw error instanceof Error ? error : new Error("Lỗi khi cập nhật thể loại");
    }
  }

  // [DELETE]
  static async deleteGenre(id: number): Promise<any> {
    try {
      const deletedGenre = await Genre.findOneAndDelete({ id });
      if (!deletedGenre) {
        throw new Error(`Không tìm thấy thể loại với ID ${id}`);
      }
      return deletedGenre;
    } catch (error) {
      throw new Error("Lỗi khi xóa thể loại");
    }
  }

  // [Search]
  static async searchGenres(keyword: string): Promise<any[]> {
    try {
      return await Genre.find({ name: new RegExp(keyword, "i") });
    } catch (error) {
      throw new Error("Lỗi khi tìm kiếm thể loại");
    }
  }

  // [GetMoviebyGenre]
  static async getMoviesByGenre(genreName: string): Promise<any[]> {
    try {
      const genre = await Genre.findOne({ name: new RegExp(`^${genreName}$`, "i") });
      if (!genre) {
        throw new Error(`Không tìm thấy thể loại: ${genreName}`);
      }
      const movies = await Movie.find({ genreIds: genre.id });
      return movies;
    } catch (error) {
      throw error instanceof Error ? error : new Error("Lỗi khi lấy phim theo thể loại");
    }
  }
}