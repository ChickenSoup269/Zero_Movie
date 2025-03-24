import { Request, Response } from "express";
import { MovieService } from "../services/movieServices";

export async function getMovies(req: Request, res: Response): Promise<void> {
  try {
    const movies = await MovieService.getAllMovies();
    res.status(200).json(movies);
  } catch (error) {
    console.error("Lỗi lấy danh sách phim:", error);
    res.status(500).json({ message: (error as Error).message || "Lỗi server" });
  }
}

export async function getMovieById(req: Request<{ id: string }>, res: Response): Promise<void> {
  try {
    const tmdbId = parseInt(req.params.id, 10);
    const movie = await MovieService.getMovieById(tmdbId);
    res.status(200).json(movie);
  } catch (error) {
    console.error("Lỗi khi lấy phim:", error);
    const message = (error as Error).message || "Lỗi khi lấy phim";
    res.status(message.includes("Không tìm thấy") ? 404 : 500).json({ message });
  }
}

export async function searchMovies(req: Request<{ title: string }>, res: Response): Promise<void> {
  try {
    const title = req.params.title;
    const movies = await MovieService.searchMoviesByTitle(title);
    res.status(200).json(movies);
  } catch (error) {
    console.error("Lỗi khi tìm kiếm phim:", error);
    res.status(500).json({ message: (error as Error).message || "Lỗi khi tìm kiếm phim" });
  }
}

export async function addMovie(req: Request, res: Response): Promise<void> {
  try {
    const movie = await MovieService.addMovie(req.body);
    res.status(201).json({ message: "Thêm phim thành công", movie });
  } catch (error) {
    console.error("Lỗi khi thêm phim:", error);
    res.status(500).json({ message: (error as Error).message || "Lỗi khi thêm phim" });
  }
}

export async function updateMovie(req: Request<{ id: string }>, res: Response): Promise<void> {
  try {
    const tmdbId = parseInt(req.params.id, 10);
    const updatedMovie = await MovieService.updateMovie(tmdbId, req.body);
    res.status(200).json({ message: "Cập nhật thành công", movie: updatedMovie });
  } catch (error) {
    console.error("Lỗi khi cập nhật phim:", error);
    const message = (error as Error).message || "Lỗi khi cập nhật phim";
    res.status(message.includes("Không tìm thấy") ? 404 : 500).json({ message });
  }
}

export async function deleteMovie(req: Request<{ id: string }>, res: Response): Promise<void> {
  try {
    const tmdbId = parseInt(req.params.id, 10);
    await MovieService.deleteMovie(tmdbId);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa phim:", error);
    const message = (error as Error).message || "Lỗi khi xóa phim";
    res.status(message.includes("Không tìm thấy") ? 404 : 500).json({ message });
  }
}