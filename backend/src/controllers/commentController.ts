import { Request, Response } from "express"
import { CommentService } from "../services/commentServices"

export class CommentController {
  // [Add]
  static async addComment(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id // Lấy từ authMiddleware
      const { movieId, content } = req.body
      if (!movieId || !content) {
        res
          .status(400)
          .json({ message: "Thiếu movieId hoặc nội dung bình luận" })
        return
      }
      const comment = await CommentService.addComment(userId, movieId, content)
      res.status(201).json({ message: "Thêm bình luận thành công", comment })
    } catch (error) {
      res
        .status(400)
        .json({ message: (error as Error).message || "Lỗi khi thêm bình luận" })
    }
  }

  // [GET] all
  static async getComments(req: Request, res: Response): Promise<void> {
    try {
      const movieId = parseInt(req.params.movieId)
      const comments = await CommentService.getCommentsByMovie(movieId)
      res
        .status(200)
        .json({ message: "Lấy danh sách bình luận thành công", comments })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message || "Lỗi khi lấy danh sách bình luận",
      })
    }
  }

  // [UPDATE]
  static async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id
      const commentId = req.params.commentId
      const { content } = req.body
      if (!content) {
        res.status(400).json({ message: "Thiếu nội dung bình luận" })
        return
      }
      const comment = await CommentService.updateComment(
        commentId,
        userId,
        content
      )
      res.status(200).json({ message: "Sửa bình luận thành công", comment })
    } catch (error) {
      res
        .status(400)
        .json({ message: (error as Error).message || "Lỗi khi sửa bình luận" })
    }
  }

  // [DELETE]
  static async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id
      const role = (req as any).user.role
      const commentId = req.params.commentId
      await CommentService.deleteComment(commentId, userId, role)
      res.status(200).json({ message: "Xóa bình luận thành công" })
    } catch (error) {
      res
        .status(400)
        .json({ message: (error as Error).message || "Lỗi khi xóa bình luận" })
    }
  }
}
