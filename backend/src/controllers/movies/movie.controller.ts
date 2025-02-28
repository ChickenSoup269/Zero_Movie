import { Request, Response } from "express";
import * as movieService from "../../services/movies/movie.service";
import { IMovie } from "../../models/movies/Movie";

// Lấy danh sách tất cả phim
export const getAllMovies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const movies = await movieService.getAllMovies();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách phim",
      error: (error as Error).message,
    });
  }
};

// Lấy thông tin chi tiết một phim theo ID
export const getMovieById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "ID không hợp lệ" });
      return;
    }
    const movie = await movieService.getMovieById(id);
    if (!movie) {
      res.status(404).json({ message: "Không tìm thấy phim" });
      return;
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin phim",
      error: (error as Error).message,
    });
  }
};

// Tạo một phim mới
export const createMovie = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const movieData = req.body as IMovie;
    const newMovie = await movieService.createMovie(movieData);
    res.status(201).json(newMovie);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo phim", error: (error as Error).message });
  }
};

// Cập nhật phim theo ID
export const updateMovie = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "ID không hợp lệ" });
      return;
    }
    const updateData = req.body as Partial<IMovie>;
    const updatedMovie = await movieService.updateMovie(id, updateData);
    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật phim",
      error: (error as Error).message,
    });
  }
};

// Xóa phim theo ID
export const deleteMovie = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "ID không hợp lệ" });
      return;
    }
    await movieService.deleteMovie(id);
    res.status(200).json({ message: "Xóa phim thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa phim", error: (error as Error).message });
  }
};
