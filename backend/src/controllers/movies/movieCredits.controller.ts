import { Request, Response } from "express";
import { getMovieCredits } from "../../services/movies/movieCredits.service";
import { IMovieCredits } from "../../models/movies/MovieCredits";

// Lấy danh sách credits theo ID phim
export const getMovieCreditsController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "ID không hợp lệ" });
      return;
    }
    const movieCredits = await getMovieCredits(id);
    if (!movieCredits) {
      res.status(404).json({ message: "Không tìm thấy credits phim" });
      return;
    }
    res.status(200).json(movieCredits);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy credits phim",
      error: (error as Error).message,
    });
  }
};
