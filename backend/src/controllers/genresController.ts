import { Request, Response } from 'express';
import { GenreService } from '../services/genresService';

export class GenreController {
  static async getAllGenres(req: Request, res: Response): Promise<void> {
    try {
      const genres = await GenreService.getAllGenres();
      res.status(200).json({ message: 'Lấy danh sách thể loại thành công', genres });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || 'Lỗi khi lấy danh sách thể loại' });
    }
  }

  static async addGenre(req: Request, res: Response): Promise<void> {
    try {
      const { id, name } = req.body;
      if (!id || !name) {
        res.status(400).json({ message: 'Thiếu id hoặc name' });
        return;
      }
      const genre = await GenreService.addGenre(id, name);
      res.status(201).json({ message: 'Thêm thể loại thành công', genre });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message || 'Lỗi khi thêm thể loại' });
    }
  }

  static async updateGenre(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ message: 'Thiếu name' });
        return;
      }
      const genre = await GenreService.updateGenre(id, name);
      res.status(200).json({ message: 'Cập nhật thể loại thành công', genre });
    } catch (error) {
      res.status(error instanceof Error && error.message.includes('Không tìm thấy') ? 404 : 400).json({
        message: (error as Error).message || 'Lỗi khi cập nhật thể loại',
      });
    }
  }

  static async deleteGenre(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const genre = await GenreService.deleteGenre(id);
      res.status(200).json({ message: 'Xóa thể loại thành công', genre });
    } catch (error) {
      res.status(error instanceof Error && error.message.includes('Không tìm thấy') ? 404 : 500).json({
        message: (error as Error).message || 'Lỗi khi xóa thể loại',
      });
    }
  }

  static async searchGenres(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        res.status(400).json({ message: 'Thiếu query tìm kiếm' });
        return;
      }
      const genres = await GenreService.searchGenres(q);
      res.status(200).json({ message: 'Tìm kiếm thể loại thành công', genres });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || 'Lỗi khi tìm kiếm thể loại' });
    }
  }

  static async getMoviesByGenre(req: Request, res: Response): Promise<void> {
    try {
      const { genreName } = req.params;
      const movies = await GenreService.getMoviesByGenre(genreName);
      res.status(200).json({ message: 'Lấy danh sách phim theo thể loại thành công', movies });
    } catch (error) {
      res.status(error instanceof Error && error.message.includes('Không tìm thấy') ? 404 : 500).json({
        message: (error as Error).message || 'Lỗi khi lấy phim theo thể loại',
      });
    }
  }
}