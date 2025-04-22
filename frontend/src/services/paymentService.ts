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
  amount?: number // Optional, as backend might calculate it
  paymentMethod?: "paypal" // Default to PayPal
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
  paymentMethod?: "paypal"
  transactionId?: string
  createdAt?: string
  updatedAt?: string
}

// Interface for create payment response
interface CreatePaymentResponse {
  status: "OK" | "ERR"
  message: string
  data: {
    payment: Payment
    orderId?: string
    approveUrl?: string
  }
}

// Interface for capture payment response
interface CapturePaymentResponse {
  status: "OK" | "ERR"
  message: string
  data: {
    payment: Payment
  }
}

// Create a payment (POST /payments/create)
export const createPayment = async (
  data: CreatePaymentRequest
): Promise<CreatePaymentResponse> => {
  try {
    const res = await axiosJWT.post(`${API_URL}/payments/create`, {
      ...data,
      paymentMethod: "paypal", // Ensure PayPal is set
    })
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response?.data || axiosError
  }
}

// Capture a payment (GET /payments/success)
export const capturePayment = async (query: {
  token: string
}): Promise<CapturePaymentResponse> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/payments/success`, {
      params: { token: query.token },
    })
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response?.data || axiosError
  }
}

// Get payment status (GET /payments/:id)
export const getPaymentStatus = async (
  paymentId: string
): Promise<CreatePaymentResponse> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/payments/${paymentId}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response?.data || axiosError
  }
}
