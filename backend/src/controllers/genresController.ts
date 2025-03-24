import { Request, Response } from "express";
import { GenreService } from "../services/genresService";

export async function getGenres(req: Request, res: Response): Promise<void> {
  try {
    const genres = await GenreService.getAllGenres();
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message || "Lỗi server" });
  }
}

export async function addGenre(req: Request, res: Response): Promise<void> {
  try {
    const { id, name } = req.body;
    const genre = await GenreService.addGenre(id, name);
    res.status(201).json(genre);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message || "Lỗi server" });
  }
}

export async function updateGenre(req: Request<{ id: string }>, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    const updatedGenre = await GenreService.updateGenre(id, name);
    res.status(200).json(updatedGenre);
  } catch (error) {
    const message = (error as Error).message || "Lỗi server";
    res.status(message.includes("Không tìm thấy") ? 404 : 500).json({ message });
  }
}

export async function deleteGenre(req: Request<{ id: string }>, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const deletedGenre = await GenreService.deleteGenre(id);
    res.status(200).json({ message: "Đã xóa thể loại thành công", deletedGenre });
  } catch (error) {
    const message = (error as Error).message || "Lỗi server";
    res.status(message.includes("Không tìm thấy") ? 404 : 500).json({ message });
  }
}

export async function searchGenre(req: Request, res: Response): Promise<void> {
  try {
    const { keyword } = req.query;
    const genres = await GenreService.searchGenres(keyword as string);
    res.status(200).json(genres.length ? genres : { message: "Không tìm thấy thể loại nào phù hợp" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message || "Lỗi server" });
  }
}

export async function getMoviesByGenre(req: Request<{ genreName: string }>, res: Response): Promise<void> {
  try {
    const { genreName } = req.params;
    const movies = await GenreService.getMoviesByGenre(genreName);
    res.status(200).json(movies.length ? movies : { message: `Không có phim nào thuộc thể loại: ${genreName}` });
  } catch (error) {
    const message = (error as Error).message || "Lỗi server";
    res.status(message.includes("Không tìm thấy") ? 404 : 500).json({ message });
  }
}