/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig } from "axios"

// Create axios instance
const axiosJWT = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // 10s timeout
})

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

// Token management
let accessToken: string | null = localStorage.getItem("token")

export const updateToken = (token: string | null) => {
  accessToken = token
  if (token) {
    localStorage.setItem("token", token)
  } else {
    localStorage.removeItem("token")
  }
}

// Interceptor to add token to requests
axiosJWT.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
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
        // Giả sử có API refresh token
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            refreshToken: localStorage.getItem("refreshToken"),
          }
        )
        const newToken = response.data.accessToken
        updateToken(newToken)
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        }
        return axiosJWT(originalRequest)
      } catch (refreshError) {
        updateToken(null) // Clear token on refresh failure
        return Promise.reject(refreshError)
      }
    }
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

// Interface for comment data (matches IComment from backend)
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
  message?: string
  data?: T
}

// Add a comment (POST /comments)
export const addComment = async (
  data: CommentRequest,
  signal?: AbortSignal
): Promise<ApiResponse<Comment>> => {
  try {
    if (!accessToken) {
      throw new Error("No access token available. Please log in.")
    }
    const res = await axiosJWT.post<ApiResponse<Comment>>("/comments", data, {
      signal,
    })
    if (res.data.status === "ERR") {
      throw new Error(res.data.message || "Failed to add comment")
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>
    throw (
      axiosError.response?.data || {
        status: "ERR",
        message: axiosError.message,
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
    if (res.data.status === "ERR") {
      throw new Error(res.data.message || "Failed to fetch comments")
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>
    throw (
      axiosError.response?.data || {
        status: "ERR",
        message: axiosError.message,
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
      throw new Error("No access token available. Please log in.")
    }
    const res = await axiosJWT.put<ApiResponse<Comment>>(
      `/comments/${commentId}`,
      { content },
      { signal }
    )
    if (res.data.status === "ERR") {
      throw new Error(res.data.message || "Failed to update comment")
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>
    throw (
      axiosError.response?.data || {
        status: "ERR",
        message: axiosError.message,
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
      throw new Error("No access token available. Please log in.")
    }
    const res = await axiosJWT.delete<ApiResponse<void>>(
      `/comments/${commentId}`,
      { signal }
    )
    if (res.data.status === "ERR") {
      throw new Error(res.data.message || "Failed to delete comment")
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>
    throw (
      axiosError.response?.data || {
        status: "ERR",
        message: axiosError.message,
      }
    )
  }
}
