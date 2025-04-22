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
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interface for seat data
interface Seat {
  _id: string
  roomId: string
  seatNumber: string
  row: string
  column: number
  type: "standard"
  createdAt?: string
  updatedAt?: string
}

// Interface for creating/updating a seat
interface SeatRequest {
  roomId: string
  seatNumber: string
  row: string
  column: number
  type?: "standard"
}

// Interface for API response
interface ApiResponse<T = any> {
  status: "OK" | "ERR"
  message?: string
  data?: T
}

// Create a seat (POST /seats)
export const createSeat = async (
  data: SeatRequest
): Promise<ApiResponse<Seat>> => {
  try {
    const res = await axiosJWT.post(`${API_URL}/seats`, data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
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

// Update a seat (PUT /seats/:id)
export const updateSeat = async (
  seatId: string,
  data: Partial<SeatRequest>
): Promise<ApiResponse<Seat>> => {
  try {
    const res = await axiosJWT.put(`${API_URL}/seats/${seatId}`, data)
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
