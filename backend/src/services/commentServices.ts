import Comment, { IComment } from "../models/commentModel"
import User from "../models/userModel"

export class CommentService {
  // [Add]
  static async addComment(
    userId: string,
    movieId: number,
    content: string
  ): Promise<IComment> {
    try {
      const comment = new Comment({
        userId,
        movieId,
        content,
      })
      return await comment.save()
    } catch (error) {
      throw new Error("Lỗi khi thêm bình luận")
    }
  }

  // [GET]all
  static async getCommentsByMovie(movieId: number): Promise<IComment[]> {
    try {
      return await Comment.find({ movieId })
        .populate("userId", "username fullName avatar")
        .sort({ createdAt: -1 })
    } catch (error) {
      throw new Error("Lỗi khi lấy danh sách bình luận")
    }
  }

  // [update]
  static async updateComment(
    commentId: string,
    userId: string,
    content: string
  ): Promise<IComment> {
    try {
      const comment = await Comment.findOne({ _id: commentId, userId })
      if (!comment)
        throw new Error("Không tìm thấy bình luận hoặc bạn không có quyền sửa")
      comment.content = content
      return await comment.save()
    } catch (error) {
      throw error instanceof Error ? error : new Error("Lỗi khi sửa bình luận")
    }
  }

  // [Delete]
  static async deleteComment(
    commentId: string,
    userId: string,
    role: string
  ): Promise<void> {
    try {
      const query =
        role === "admin" ? { _id: commentId } : { _id: commentId, userId }
      const comment = await Comment.findOneAndDelete(query)
      if (!comment)
        throw new Error("Không tìm thấy bình luận hoặc bạn không có quyền xóa")
    } catch (error) {
      throw error instanceof Error ? error : new Error("Lỗi khi xóa bình luận")
    }
  }
}
