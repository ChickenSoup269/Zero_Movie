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
axiosJWT.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    console.log("showtimeSeat request URL:", config.url)
    console.log(
      "Token in showtimeSeat interceptor:",
      token ? `Present: ${token}` : "Missing"
    )
    if (token && config.method === "put") {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error("showtimeSeat request interceptor error:", error)
    return Promise.reject(error)
  }
)

// Interface for showtime-seat data (matched with backend response)
interface ShowtimeSeat {
  id: string // ShowtimeSeat._id
  showtimeId: string
  seatId: string // Seat._id
  seatNumber: string
  status: "available" | "booked" | "reserved"
}

// Interface for updating seat status (matched with backend input)
interface UpdateSeatStatusRequest {
  status: "available" | "booked" | "reserved"
}

// Interface for API response (matched with backend structure)
interface ApiResponse<T = any> {
  message: string
  seat?: T
  seats?: T[]
}

// Get seats by showtime ID (GET /showtimeseat/showtime/:showtimeId)
export const getSeatsByShowtime = async (
  showtimeId: string
): Promise<ApiResponse<ShowtimeSeat[]>> => {
  try {
    const res = await axiosJWT.get(
      `${API_URL}/showtimeseat/showtime/${showtimeId}`
    )
    console.log("getSeatsByShowtime response:", res.data)

    if (!res.data.seats || !Array.isArray(res.data.seats)) {
      return { message: res.data.message || "Không có ghế nào", seats: [] }
    }

    return {
      message: res.data.message,
      seats: res.data.seats
        .filter((seat: any) => seat._id && seat.seatId && seat.seatNumber)
        .map((seat: any) => ({
          id: seat._id.toString(),
          showtimeId: seat.showtimeId?.toString() || "",
          seatId: seat.seatId?.toString() || "",
          seatNumber: seat.seatNumber || "Unknown",
          status: seat.status || "available",
        })),
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    console.error("getSeatsByShowtime error:", {
      message: axiosError.message,
      response: errorData,
      status: axiosError.response?.status,
    })
    throw new Error(errorData?.message || axiosError.message)
  }
}

// Update seat status (PUT /showtimeseat/showtime/:showtimeId/seat/:seatId)
export const updateSeatStatus = async (
  showtimeId: string,
  seatId: string, // ShowtimeSeat._id
  data: UpdateSeatStatusRequest
): Promise<ApiResponse<ShowtimeSeat>> => {
  try {
    const res = await axiosJWT.put(
      `${API_URL}/showtimeseat/showtime/${showtimeId}/seat/${seatId}`,
      data
    )
    console.log("updateSeatStatus response:", res.data)
    return {
      message: res.data.message,
      seat: {
        id: res.data.seat._id?.toString() || "",
        showtimeId: res.data.seat.showtimeId?.toString() || "",
        seatId: res.data.seat.seatId?.toString() || "",
        seatNumber: res.data.seat.seatNumber || "Unknown",
        status: res.data.seat.status || "available",
      },
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    console.error("updateSeatStatus error:", {
      message: axiosError.message,
      response: errorData,
      status: axiosError.response?.status,
    })
    throw new Error(errorData?.message || axiosError.message)
  }
}
