import { Request, Response } from 'express';
import { MovieService } from '../services/movieServices';

export class MovieController {
  static async getAllMovies(req: Request, res: Response): Promise<void> {
    try {
      const movies = await MovieService.getAllMovies();
      res.status(200).json({ message: 'Lấy danh sách phim thành công', movies });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || 'Lỗi khi lấy danh sách phim' });
    }
  }

  static async getMovieById(req: Request, res: Response): Promise<void> {
    try {
      const tmdbId = parseInt(req.params.tmdbId);
      const movie = await MovieService.getMovieById(tmdbId);
      res.status(200).json({ message: 'Lấy thông tin phim thành công', movie });
    } catch (error) {
      res.status(error instanceof Error && error.message === 'Không tìm thấy phim' ? 404 : 500).json({
        message: (error as Error).message || 'Lỗi khi lấy thông tin phim',
      });
    }
  }

  static async searchMovies(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        res.status(400).json({ message: 'Thiếu query tìm kiếm' });
        return;
      }
      const movies = await MovieService.searchMoviesByTitle(q);
      res.status(200).json({ message: 'Tìm kiếm phim thành công', movies });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || 'Lỗi khi tìm kiếm phim' });
    }
  }

  static async addMovie(req: Request, res: Response): Promise<void> {
    try {
      const movieData = req.body;
      const movie = await MovieService.addMovie(movieData);
      res.status(201).json({ message: 'Thêm phim thành công', movie });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message || 'Lỗi khi thêm phim' });
    }
  }

  static async updateMovie(req: Request, res: Response): Promise<void> {
    try {
      const tmdbId = parseInt(req.params.tmdbId);
      const movieData = req.body;
      const movie = await MovieService.updateMovie(tmdbId, movieData);
      res.status(200).json({ message: 'Cập nhật phim thành công', movie });
    } catch (error) {
      res.status(error instanceof Error && error.message === 'Không tìm thấy phim' ? 404 : 400).json({
        message: (error as Error).message || 'Lỗi khi cập nhật phim',
      });
    }
  }

  static async deleteMovie(req: Request, res: Response): Promise<void> {
    try {
      const tmdbId = parseInt(req.params.tmdbId);
      const movie = await MovieService.deleteMovie(tmdbId);
      res.status(200).json({ message: 'Xóa phim thành công', movie });
    } catch (error) {
      res.status(error instanceof Error && error.message === 'Không tìm thấy phim' ? 404 : 500).json({
        message: (error as Error).message || 'Lỗi khi xóa phim',
      });
    }
  }
}