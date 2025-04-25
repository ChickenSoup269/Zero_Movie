/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios"

// Create axios instance
const axiosJWT = axios.create()

// Read API base URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

// Add token to requests via interceptor for all authenticated endpoints
axiosJWT.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  console.log("Request URL:", config.url)
  console.log("Token in interceptor:", token ? `Present: ${token}` : "Missing")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    console.warn(
      "No access_token found in localStorage for request:",
      config.url
    )
  }
  return config
})

// Handle 401 Unauthorized responses
axiosJWT.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error(
        "401 Unauthorized:",
        error.response?.data || "No response data"
      )
      localStorage.removeItem("access_token")
      window.location.href = "/login"
      return Promise.reject(
        new Error(
          error.response?.data?.message ||
            "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
        )
      )
    }
    return Promise.reject(error)
  }
)

// Interface for payment creation request
interface CreatePaymentRequest {
  bookingId: string
  amount?: number
  paymentMethod?: "paypal"
  currency?: string
  description?: string
}

// Interface for payment
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

// Interface for create payment response (matches paymentController.ts)
interface CreatePaymentResponse {
  message: string
  payment: Payment
  orderId?: string
  approveUrl?: string
}

// Interface for capture payment response (matches paymentController.ts)
interface CapturePaymentResponse {
  message: string
  payment: Payment
}

// Interface for payment history response
interface PaymentHistoryResponse {
  message: string
  payments: Payment[]
}

// Create a payment (POST /payments/create)
export const createPayment = async (
  data: CreatePaymentRequest
): Promise<CreatePaymentResponse> => {
  try {
    const token = localStorage.getItem("access_token")
    console.log(
      "Token in createPayment:",
      token ? `Present: ${token}` : "Missing"
    )
    if (!token) {
      console.error("No access_token found for createPayment")
      throw new Error("Vui lòng đăng nhập để thực hiện thanh toán")
    }
    console.log("Creating payment with data:", data)
    const res = await axiosJWT.post(`${API_URL}/payments/create`, {
      ...data,
      paymentMethod: "paypal",
    })
    console.log("createPayment response:", res.data)
    return res.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as
      | { status?: string; message?: string }
      | undefined
    console.error("createPayment error:", {
      message: errorData?.message || axiosError.message || "Unknown error",
      status: axiosError.response?.status || "No status",
      response: errorData || "No response data",
      stack: axiosError.stack,
    })
    if (
      axiosError.response?.status === 401 &&
      errorData?.message === "No access token available. Please log in."
    ) {
      console.warn(
        "Backend returned no access token error, redirecting to login"
      )
      localStorage.removeItem("access_token")
      window.location.href = "/login"
    }
    throw new Error(
      errorData?.message ||
        axiosError.message ||
        "Lỗi khi tạo thanh toán. Vui lòng thử lại."
    )
  }
}

// Capture a payment (GET /payments/success)
export const capturePayment = async (query: {
  token: string
}): Promise<CapturePaymentResponse> => {
  try {
    console.log("Capturing payment with token:", query.token)
    const res = await axiosJWT.get(`${API_URL}/payments/success`, {
      params: { token: query.token },
    })
    console.log("capturePayment response:", res.data)
    return res.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as
      | { message?: string }
      | undefined
    console.error("capturePayment error:", {
      message: errorData?.message || axiosError.message || "Unknown error",
      status: axiosError.response?.status || "No status",
      response: errorData || "No response data",
    })
    throw new Error(
      errorData?.message || axiosError.message || "Lỗi khi xác nhận thanh toán"
    )
  }
}

// Get payment status (GET /payments/:id)
export const getPaymentStatus = async (
  paymentId: string
): Promise<CreatePaymentResponse> => {
  try {
    const token = localStorage.getItem("access_token")
    console.log(
      "Token in getPaymentStatus:",
      token ? `Present: ${token}` : "Missing"
    )
    if (!token) {
      console.error("No access_token found for getPaymentStatus")
      throw new Error("Vui lòng đăng nhập để kiểm tra trạng thái thanh toán")
    }
    console.log("Getting payment status for paymentId:", paymentId)
    const res = await axiosJWT.get(`${API_URL}/payments/${paymentId}`)
    console.log("getPaymentStatus response:", res.data)
    return res.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as
      | { message?: string }
      | undefined
    console.error("getPaymentStatus error:", {
      message: errorData?.message || axiosError.message || "Unknown error",
      status: axiosError.response?.status || "No status",
      response: errorData || "No response data",
    })
    throw new Error(
      errorData?.message ||
        axiosError.message ||
        "Lỗi khi kiểm tra trạng thái thanh toán"
    )
  }
}

// Get payment history (GET /payments/history)
export const getPaymentHistory = async (): Promise<PaymentHistoryResponse> => {
  try {
    const token = localStorage.getItem("access_token")
    console.log(
      "Token in getPaymentHistory:",
      token ? `Present: ${token}` : "Missing"
    )
    if (!token) {
      console.error("No access_token found for getPaymentHistory")
      throw new Error("Vui lòng đăng nhập để xem lịch sử thanh toán")
    }
    console.log("Fetching payment history")
    const res = await axiosJWT.get(`${API_URL}/payments/history`)
    console.log("getPaymentHistory response:", res.data)
    return res.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as
      | { status?: string; message?: string }
      | undefined
    console.error("getPaymentHistory error:", {
      message: errorData?.message || axiosError.message || "Unknown error",
      status: axiosError.response?.status || "No status",
      response: errorData || "No response data",
    })
    if (
      axiosError.response?.status === 401 &&
      errorData?.message === "No access token available. Please log in."
    ) {
      console.warn(
        "Backend returned no access token error, redirecting to login"
      )
      localStorage.removeItem("access_token")
      window.location.href = "/login"
    }
    throw new Error(
      errorData?.message ||
        axiosError.message ||
        "Lỗi khi lấy lịch sử thanh toán"
    )
  }
}
