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
    const token = localStorage.getItem("token") // Replace with your token Reviews retrieval method
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interface for seat data
interface Seat {
  id: string
  roomId: string
  seatNumber: string // e.g., 'A1', 'B12'
  status: "available" | "reserved" | "booked" // Adjust based on backend
  type: "standard" | "VIP" | "accessible" // Adjust based on backend
  createdAt: string
  // Add other fields as needed
}

// Interface for API response (matches authService.js style)
interface ApiResponse<T = any> {
  status: "OK" | "ERR"
  message?: string
  data?: T
}

// Get seats by room ID (GET /seats/room/:roomId)
export const getSeatsByRoom = async (
  roomId: string
): Promise<ApiResponse<Seat[]>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/seats/room/${roomId}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Get seat by ID (GET /seats/:id)
export const getSeatById = async (
  seatId: string
): Promise<ApiResponse<Seat>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/seats/${seatId}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Delete a seat (DELETE /seats/:id)
export const deleteSeat = async (
  seatId: string
): Promise<ApiResponse<void>> => {
  try {
    const res = await axiosJWT.delete(`${API_URL}/seats/${seatId}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}
