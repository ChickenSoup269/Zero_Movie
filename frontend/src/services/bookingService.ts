/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios"

// Create axios instance
const axiosJWT = axios.create()

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

axiosJWT.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

interface Booking {
  id: string
  eventId: string
  seats: number
  createdAt: string
}

interface CreateBookingRequest {
  eventId: string
  seats: number
}

interface ApiResponse<T = any> {
  status: "OK" | "ERR"
  message?: string
  data?: T
}

// Create a booking (POST /bookings)
export const createBooking = async (
  data: CreateBookingRequest
): Promise<ApiResponse<Booking>> => {
  try {
    const res = await axiosJWT.post(`${API_URL}/bookings`, data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Get user bookings (GET /bookings/my-bookings)
export const getUserBookings = async (): Promise<ApiResponse<Booking[]>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/bookings/my-bookings`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Delete a booking (DELETE /bookings/:bookingId)
export const deleteBooking = async (
  bookingId: string
): Promise<ApiResponse<void>> => {
  try {
    const res = await axiosJWT.delete(`${API_URL}/bookings/${bookingId}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}
