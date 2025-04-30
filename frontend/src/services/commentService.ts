/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig } from "axios"

// Create axios instance
const axiosJWT = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

// Token management
let accessToken: string | null = localStorage.getItem("access_token")

export const updateToken = (token: string | null) => {
  accessToken = token
  if (token) {
    localStorage.setItem("access_token", token)
  } else {
    localStorage.removeItem("access_token")
  }
}

// Interceptor to add token to requests
axiosJWT.interceptors.request.use(
  (config) => {
    console.log("Request config:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      hasToken: !!accessToken,
    })
    if (accessToken && config.method !== "get") {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  }
)

// Interceptor to handle token refresh
axiosJWT.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        console.log("Attempting to refresh token...")
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            refreshToken: localStorage.getItem("refreshToken"),
          }
        )
        const newToken = response.data.accessToken
        console.log("Token refreshed successfully:", newToken)
        updateToken(newToken)
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        }
        return axiosJWT(originalRequest)
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError)
        updateToken(null)
        localStorage.removeItem("refreshToken")
        return Promise.reject(refreshError)
      }
    }
    console.error("Response error:", {
      status: error.response?.status,
      data: error.response?.data,
    })
    return Promise.reject(error)
  }
)

// Interface for user data (populated in comments)
interface User {
  _id: string
  username: string
  fullName: string
  avatar?: string
}

// Interface for comment data (matches backend IComment)
interface Comment {
  _id: string
  userId: User // Populated user data
  movieId: number
  content: string
  createdAt: string
  updatedAt: string
}

// Interface for adding/updating a comment request
interface CommentRequest {
  movieId: number
  content: string
}

// Interface for API response
interface ApiResponse<T> {
  status: "OK" | "ERR"
  message: string
  comment?: T extends Comment ? Comment : never
  comments?: T extends Comment[] ? Comment[] : never
}

// Add a comment (POST /comments)
export const addComment = async (
  data: CommentRequest,
  signal?: AbortSignal
): Promise<ApiResponse<Comment>> => {
  try {
    if (!accessToken) {
      console.warn("No access token available for addComment")
      return {
        status: "ERR",
        message: "No access token available. Please log in.",
      }
    }
    const res = await axiosJWT.post<ApiResponse<Comment>>("/comments", data, {
      signal,
    })
    console.log("addComment response:", res.data)
    if (res.data.status === "ERR") {
      return {
        status: "ERR",
        message: res.data.message || "Failed to add comment",
      }
    }
    return {
      status: "OK",
      message: res.data.message || "Comment added successfully",
      comment: res.data.comment!,
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<Comment>>
    console.error(
      "addComment error:",
      axiosError.response?.data || axiosError.message
    )
    return (
      axiosError.response?.data || {
        status: "ERR",
        message: axiosError.message || "Error adding comment",
      }
    )
  }
}

// Get comments by movie ID (GET /comments/:movieId)
export const getCommentsByMovie = async (
  movieId: number,
  signal?: AbortSignal
): Promise<ApiResponse<Comment[]>> => {
  try {
    const res = await axiosJWT.get<ApiResponse<Comment[]>>(
      `/comments/${movieId}`,
      { signal }
    )
    console.log("getCommentsByMovie response:", res.data)
    if (res.data.status === "ERR") {
      return {
        status: "ERR",
        message: res.data.message || "Failed to fetch comments",
      }
    }
    return {
      status: "OK",
      message: res.data.message || "Comments fetched successfully",
      comments: res.data.comments!,
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<Comment[]>>
    console.error(
      "getCommentsByMovie error:",
      axiosError.response?.data || axiosError.message
    )
    return (
      axiosError.response?.data || {
        status: "ERR",
        message: axiosError.message || "Error fetching comments",
      }
    )
  }
}

// Update a comment (PUT /comments/:commentId)
export const updateComment = async (
  commentId: string,
  content: string,
  signal?: AbortSignal
): Promise<ApiResponse<Comment>> => {
  try {
    if (!accessToken) {
      console.warn("No access token available for updateComment")
      return {
        status: "ERR",
        message: "No access token available. Please log in.",
      }
    }
    const res = await axiosJWT.put<ApiResponse<Comment>>(
      `/comments/${commentId}`,
      { content },
      { signal }
    )
    console.log("updateComment response:", res.data)
    if (res.data.status === "ERR") {
      return {
        status: "ERR",
        message: res.data.message || "Failed to update comment",
      }
    }
    return {
      status: "OK",
      message: res.data.message || "Comment updated successfully",
      comment: res.data.comment!,
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<Comment>>
    console.error(
      "updateComment error:",
      axiosError.response?.data || axiosError.message
    )
    return (
      axiosError.response?.data || {
        status: "ERR",
        message: axiosError.message || "Error updating comment",
      }
    )
  }
}

// Delete a comment (DELETE /comments/:commentId)
export const deleteComment = async (
  commentId: string,
  signal?: AbortSignal
): Promise<ApiResponse<void>> => {
  try {
    if (!accessToken) {
      console.warn("No access token available for deleteComment")
      return {
        status: "ERR",
        message: "No access token available. Please log in.",
      }
    }
    const res = await axiosJWT.delete<ApiResponse<void>>(
      `/comments/${commentId}`,
      { signal }
    )
    console.log("deleteComment response:", res.data)
    if (res.data.status === "ERR") {
      return {
        status: "ERR",
        message: res.data.message || "Failed to delete comment",
      }
    }
    return {
      status: "OK",
      message: res.data.message || "Comment deleted successfully",
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<void>>
    console.error(
      "deleteComment error:",
      axiosError.response?.data || axiosError.message
    )
    return (
      axiosError.response?.data || {
        status: "ERR",
        message: axiosError.message || "Error deleting comment",
      }
    )
  }
}
