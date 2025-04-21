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
  // Only add token for non-GET requests (assuming GET endpoints are public)
  if (config.method !== "get") {
    const token = localStorage.getItem("token") // Replace with your token retrieval method
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interface for room data
interface Room {
  id: string
  name: string
  cinemaId: string
  capacity: number
  type: string // e.g., '2D', '3D', 'IMAX'
  createdAt: string
  // Add other fields as needed
}

// Interface for creating/updating a room request
interface RoomRequest {
  name: string
  cinemaId: string
  capacity: number
  type: string
  // Add other fields as needed
}

// Interface for API response (matches authService.js style)
interface ApiResponse<T = any> {
  status: "OK" | "ERR"
  message?: string
  data?: T
}

// Create a room (POST /rooms)
export const createRoom = async (
  data: RoomRequest
): Promise<ApiResponse<Room>> => {
  try {
    const res = await axiosJWT.post(`${API_URL}/rooms`, data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Get all rooms (GET /rooms)
export const getAllRooms = async (): Promise<ApiResponse<Room[]>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/rooms`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Get room by ID (GET /rooms/:id)
export const getRoomById = async (
  roomId: string
): Promise<ApiResponse<Room>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/rooms/${roomId}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Update a room (PUT /rooms/:id)
export const updateRoom = async (
  roomId: string,
  data: RoomRequest
): Promise<ApiResponse<Room>> => {
  try {
    const res = await axiosJWT.put(`${API_URL}/rooms/${roomId}`, data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Delete a room (DELETE /rooms/:id)
export const deleteRoom = async (
  roomId: string
): Promise<ApiResponse<void>> => {
  try {
    const res = await axiosJWT.delete(`${API_URL}/rooms/${roomId}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}
