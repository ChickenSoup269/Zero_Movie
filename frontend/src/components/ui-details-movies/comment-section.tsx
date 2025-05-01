/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState, useEffect } from "react"
import {
  addComment,
  getCommentsByMovie,
  deleteComment,
  updateComment,
} from "@/services/commentService"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Comment {
  _id: string
  userId: { _id: string; username: string; fullName: string; avatar?: string }
  movieId: number
  content: string
  createdAt: string
  updatedAt: string
}

interface CommentSectionProps {
  movieId: number
  userId?: string
  isOpen: boolean
  onClose: () => void
}

export default function CommentSection({
  movieId,
  userId,
  isOpen,
  onClose,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [failedAvatars, setFailedAvatars] = useState<Set<string>>(new Set()) // Track failed avatar URLs

  // Log userId and token for debugging
  useEffect(() => {
    console.log("CommentSection props:", { movieId, userId })
    console.log("Current access_token:", localStorage.getItem("access_token"))
  }, [movieId, userId])

  // Fetch comments
  useEffect(() => {
    if (!isOpen) return
    const fetchComments = async () => {
      try {
        setLoading(true)
        const response = await getCommentsByMovie(movieId)
        if (response.status === "OK" && response.comments) {
          setComments(response.comments)
        } else {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: response.message || "Không thể tải bình luận",
          })
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Lỗi khi tải bình luận",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchComments()
  }, [movieId, toast, isOpen])

  // Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Bình luận không được để trống",
      })
      return
    }
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng đăng nhập để bình luận",
      })
      return
    }

    try {
      const response = await addComment({ movieId, content: newComment })
      if (response.status === "OK" && response.comment) {
        setComments([...comments, response.comment])
        setNewComment("")
        toast({
          title: "Thành công",
          description: "Bình luận đã được thêm",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: response.message || "Không thể thêm bình luận",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Lỗi khi thêm bình luận",
      })
    }
  }

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng đăng nhập để xóa bình luận",
      })
      return
    }

    try {
      const response = await deleteComment(commentId)
      if (response.status === "OK") {
        setComments(comments.filter((comment) => comment._id !== commentId))
        toast({
          title: "Thành công",
          description: "Bình luận đã được xóa",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: response.message || "Không thể xóa bình luận",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Lỗi khi xóa bình luận",
      })
    }
  }

  // Edit comment
  const handleEditComment = (comment: Comment) => {
    if (userId !== comment.userId._id) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Bạn chỉ có thể chỉnh sửa bình luận của mình",
      })
      return
    }
    setEditingCommentId(comment._id)
    setEditingContent(comment.content)
  }

  // Update comment
  const handleUpdateComment = async (commentId: string) => {
    if (!editingContent.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Bình luận không được để trống",
      })
      return
    }

    try {
      const response = await updateComment(commentId, editingContent)
      if (response.status === "OK" && response.comment) {
        setComments(
          comments.map((comment) =>
            comment._id === commentId ? response.comment : comment
          )
        )
        setEditingCommentId(null)
        setEditingContent("")
        toast({
          title: "Thành công",
          description: "Bình luận đã được cập nhật",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: response.message || "Không thể cập nhật bình luận",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Lỗi khi cập nhật bình luận",
      })
    }
  }

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  }

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
  }

  // Function to get the first letter of fullName
  const getInitial = (fullName: string) => {
    return fullName ? fullName.charAt(0).toUpperCase() : "?"
  }

  // Handle avatar load error
  const handleAvatarError = (avatarUrl: string) => {
    setFailedAvatars((prev) => new Set(prev).add(avatarUrl))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white text-black dark:bg-black dark:text-white rounded-lg shadow-xl p-6 w-full max-w-2xl  relative"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Đóng popup bình luận"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3 className="text-2xl font-bold mb-6  border-b border-gray-200 pb-2">
              Bình luận
            </h3>

            {/* Form to add comment */}
            {userId ? (
              <div className="mb-6">
                <textarea
                  className="w-full p-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  rows={4}
                  placeholder="Viết bình luận của bạn..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <motion.button
                  className="mt-3 px-5 py-2 bg-blue-400 text-white rounded-full font-medium hover:bg-blue-500 transition-colors shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddComment}
                >
                  Gửi bình luận
                </motion.button>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
                <p>
                  Vui lòng{" "}
                  <a
                    href="/login"
                    className="text-blue-500 font-medium hover:underline"
                  >
                    đăng nhập
                  </a>{" "}
                  để bình luận.
                </p>
              </div>
            )}

            {/* Comments list */}
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-400 border-r-transparent"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {comments.map((comment) => {
                  const avatarUrl = comment.userId.avatar?.startsWith("http")
                    ? comment.userId.avatar
                    : `${process.env.NEXT_PUBLIC_IMAGES_API_URL}${comment.userId.avatar}`
                  const showFallback =
                    !comment.userId.avatar ||
                    failedAvatars.has(comment.userId.avatar)

                  return (
                    <motion.div
                      key={comment._id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-10 h-10 flex-shrink-0">
                          {!showFallback && avatarUrl ? (
                            <Image
                              src={avatarUrl}
                              alt={comment.userId.fullName}
                              fill
                              className="rounded-full object-cover border-2 border-blue-400"
                              loading="lazy"
                              onError={() =>
                                handleAvatarError(comment.userId.avatar!)
                              }
                            />
                          ) : (
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-400 text-white text-lg font-semibold border-2 border-blue-300"
                              title={comment.userId.fullName}
                            >
                              {getInitial(comment.userId.fullName)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {comment.userId.fullName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      {editingCommentId === comment._id ? (
                        <div>
                          <textarea
                            className="w-full p-3 rounded-lg bg-white  text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                          />
                          <div className="mt-3 flex gap-2">
                            <motion.button
                              className="px-4 py-1 bg-blue-400 text-white rounded-full font-medium hover:bg-blue-500 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              onClick={() => handleUpdateComment(comment._id)}
                            >
                              Lưu
                            </motion.button>
                            <motion.button
                              className="px-4 py-1 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              onClick={() => setEditingCommentId(null)}
                            >
                              Hủy
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      )}

                      {userId === comment.userId._id && (
                        <div className="flex gap-3 mt-3 pt-2 border-t border-gray-100">
                          <motion.button
                            className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center"
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleEditComment(comment)}
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Chỉnh sửa
                          </motion.button>
                          <motion.button
                            className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center"
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Xóa
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
