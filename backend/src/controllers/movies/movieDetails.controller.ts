import { Request, Response } from "express";
import { getMovieDetails } from "../../services/movies/movieDetails.service";
import { IMovieDetails } from "../../models/movies/MovieDetails";

// Lấy chi tiết phim theo ID
export const getMovieDetailsController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "ID không hợp lệ" });
      return;
    }
    const movieDetails = await getMovieDetails(id);
    if (!movieDetails) {
      res.status(404).json({ message: "Không tìm thấy chi tiết phim" });
      return;
    }
    res.status(200).json(movieDetails);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy chi tiết phim",
      error: (error as Error).message,
    });
  }
};
