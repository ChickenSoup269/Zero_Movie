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
  // Only add token for non-GET requests
  if (config.method !== "get") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interface for payment creation request
interface CreatePaymentRequest {
  bookingId: string
  amount: number
  paymentMethod: "paypal"
  currency?: string
  description?: string
}

// Interface for payment response
interface Payment {
  _id: string
  bookingId: string
  userId?: string
  amount: number
  status: "pending" | "completed" | "failed"
  paymentMethod: "paypal"
  transactionId?: string
  paymentUrl?: string // Only present for pending payments
  createdAt: string
  updatedAt: string
}

interface ApiResponse<T = any> {
  status: "OK" | "ERR"
  message?: string
  data?: T
}

// Create a payment (POST /payments/create)
export const createPayment = async (
  data: CreatePaymentRequest
): Promise<ApiResponse<Payment>> => {
  try {
    const res = await axiosJWT.post(`${API_URL}/payments/create`, data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Capture a payment (GET /payments/success)
export const capturePayment = async (query: {
  paymentId: string
  token?: string
}): Promise<ApiResponse<Payment>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/payments/success`, {
      params: query,
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

// Get payment status (GET /payments/:id)
export const getPaymentStatus = async (
  paymentId: string
): Promise<ApiResponse<Payment>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/payments/${paymentId}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}
