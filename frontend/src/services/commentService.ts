/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios"

// Create axios instance
const axiosJWT = axios.create()

// Read API base URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

// Add token to requests via interceptor for authenticated endpoints
axiosJWT.interceptors.request.use((config) => {
  // Only add token for non-GET requests or if explicitly needed
  if (config.method !== "get") {
    const token = localStorage.getItem("token") // Replace with your token retrieval method
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interface for user data (populated in comments)
interface User {
  username: string
  fullName: string
  avatar?: string
}

// Interface for comment data (matches IComment from backend)
interface Comment {
  id: string
  userId: User // Populated user data
  movieId: number
  content: string
  createdAt: string
  // Add other fields as needed
}

// Interface for adding/updating a comment request
interface CommentRequest {
  movieId: number
  content: string
}

// Interface for API response (matches authService.js style)
interface ApiResponse<T = any> {
  status: "OK" | "ERR"
  message?: string
  data?: T
}

// Add a comment (POST /comments)
export const addComment = async (
  data: CommentRequest
): Promise<ApiResponse<Comment>> => {
  try {
    const res = await axiosJWT.post(`${API_URL}/comments`, data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Get comments by movie ID (GET /comments/:movieId)
export const getCommentsByMovie = async (
  movieId: number
): Promise<ApiResponse<Comment[]>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/comments/${movieId}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Update a comment (PUT /comments/:commentId)
export const updateComment = async (
  commentId: string,
  content: string
): Promise<ApiResponse<Comment>> => {
  try {
    const res = await axiosJWT.put(`${API_URL}/comments/${commentId}`, {
      content,
    })
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Delete a comment (DELETE /comments/:commentId)
export const deleteComment = async (
  commentId: string
): Promise<ApiResponse<void>> => {
  try {
    const res = await axiosJWT.delete(`${API_URL}/comments/${commentId}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}
