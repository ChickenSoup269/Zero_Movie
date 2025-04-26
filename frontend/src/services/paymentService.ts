/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios"
import { refreshToken } from "./authService"

const axiosJWT = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

const API_URL = process.env.NEXT_PUBLIC_API_URL
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token")
    return token
  }
  return null
}

axiosJWT.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    console.log("Request URL:", config.url)
    console.log(
      "Token in interceptor:",
      token ? `Present: ${token.slice(0, 10)}...` : "Missing"
    )
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      console.warn("No access_token found for request:", config.url)
    }
    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  }
)

axiosJWT.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("401 Unauthorized:", {
        response: error.response?.data || "No response data",
        requestUrl: error.config?.url,
        tokenBeforeRequest: getAuthToken()
          ? `Present: ${getAuthToken().slice(0, 10)}...`
          : "Missing",
        refreshTokenAvailable: localStorage.getItem("refresh_token")
          ? "Present"
          : "Missing",
      })
      const originalRequest = error.config
      if (!originalRequest._retry) {
        originalRequest._retry = true
        try {
          const refreshTokenValue = localStorage.getItem("refresh_token")
          if (!refreshTokenValue) {
            throw new Error("Không có refresh token")
          }
          const refreshResponse = await refreshToken(refreshTokenValue)
          const { accessToken, refreshToken: newRefreshToken } = refreshResponse
          console.log(
            "New token after refresh:",
            accessToken.slice(0, 10) + "..."
          )
          localStorage.setItem("access_token", accessToken)
          localStorage.setItem("refresh_token", newRefreshToken)
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          console.log("Retrying request with new token:", originalRequest.url)
          return axiosJWT(originalRequest)
        } catch (refreshError: any) {
          console.error("Failed to refresh token:", {
            message: refreshError.message,
            response: refreshError.response?.data,
            status: refreshError.response?.status,
          })
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          return Promise.reject(
            new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.")
          )
        }
      }
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

interface CreatePaymentRequest {
  bookingId: string
  amount?: number
  paymentMethod?: "paypal"
  currency?: string
  description?: string
}

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

interface CreatePaymentResponse {
  message: string
  payment: Payment
  orderId?: string
  approveUrl?: string
}

interface CapturePaymentResponse {
  message: string
  payment: Payment
}

interface PaymentHistoryResponse {
  message: string
  payments: Payment[]
}

export const createPayment = async (
  data: CreatePaymentRequest
): Promise<CreatePaymentResponse> => {
  try {
    const token = getAuthToken()
    console.log(
      "Token in createPayment:",
      token ? `Present: ${token.slice(0, 10)}...` : "Missing"
    )
    if (!token) {
      console.error("No access_token found for createPayment")
      throw new Error("Vui lòng đăng nhập để thực hiện thanh toán")
    }
    console.log("Creating payment with data:", data)
    const res = await axiosJWT.post("/payments/create", {
      ...data,
      paymentMethod: "paypal",
    })
    console.log("createPayment response:", res.data)
    return res.data
  } catch (error: any) {
    const isAxiosError = axios.isAxiosError(error)
    let errorMessage = "Lỗi khi tạo thanh toán. Vui lòng thử lại."
    let errorDetails: any = {
      message: error.message || "Unknown error",
      response: error.response?.data || "No response data",
      status: error.response?.status || "No status",
      requestUrl: error.config?.url || "Unknown URL",
      tokenBeforeError: getAuthToken()
        ? `Present: ${getAuthToken().slice(0, 10)}...`
        : "Missing",
      refreshTokenAvailable: localStorage.getItem("refresh_token")
        ? "Present"
        : "Missing",
    }

    if (isAxiosError) {
      const axiosError = error as AxiosError
      const errorData = axiosError.response?.data as
        | { status?: string; message?: string }
        | undefined
      errorDetails = {
        ...errorDetails,
        message: errorData?.message || axiosError.message || "Unknown error",
        response: errorData || axiosError.response || "No response data",
        status: axiosError.response?.status || "No status",
      }
      errorMessage = errorData?.message || axiosError.message || errorMessage
    }

    console.error("createPayment error:", errorDetails)
    throw new Error(errorMessage)
  }
}

export const capturePayment = async (query: {
  token: string
}): Promise<CapturePaymentResponse> => {
  try {
    console.log("Capturing payment with token:", query.token)
    const res = await axiosJWT.post("/payments/capture", { token: query.token })
    console.log("capturePayment response:", res.data)
    return res.data
  } catch (error: any) {
    const isAxiosError = axios.isAxiosError(error)
    let errorMessage = "Lỗi khi xác nhận thanh toán."
    let errorDetails: any = {
      message: error.message || "Unknown error",
      response: error.response?.data || "No response data",
      status: error.response?.status || "No status",
      requestUrl: error.config?.url || "Unknown URL",
    }

    if (isAxiosError) {
      const axiosError = error as AxiosError
      const errorData = axiosError.response?.data as
        | { message?: string }
        | undefined
      errorDetails = {
        ...errorDetails,
        message: errorData?.message || axiosError.message || "Unknown error",
        response: errorData || axiosError.response || "No response data",
        status: axiosError.response?.status || "No status",
      }
      errorMessage = errorData?.message || axiosError.message || errorMessage
    }

    console.error("capturePayment error:", errorDetails)
    throw new Error(errorMessage)
  }
}

export const getPaymentStatus = async (
  paymentId: string
): Promise<CreatePaymentResponse> => {
  try {
    const token = getAuthToken()
    console.log(
      "Token in getPaymentStatus:",
      token ? `Present: ${token.slice(0, 10)}...` : "Missing"
    )
    if (!token) {
      console.error("No access_token found for getPaymentStatus")
      throw new Error("Vui lòng đăng nhập để kiểm tra trạng thái thanh toán")
    }
    console.log("Getting payment status for paymentId:", paymentId)
    const res = await axiosJWT.get(`/payments/${paymentId}`)
    console.log("getPaymentStatus response:", res.data)
    return res.data
  } catch (error: any) {
    const isAxiosError = axios.isAxiosError(error)
    let errorMessage = "Lỗi khi kiểm tra trạng thái thanh toán."
    let errorDetails: any = {
      message: error.message || "Unknown error",
      response: error.response?.data || "No response data",
      status: error.response?.status || "No status",
      requestUrl: error.config?.url || "Unknown URL",
    }

    if (isAxiosError) {
      const axiosError = error as AxiosError
      const errorData = axiosError.response?.data as
        | { message?: string }
        | undefined
      errorDetails = {
        ...errorDetails,
        message: errorData?.message || axiosError.message || "Unknown error",
        response: errorData || axiosError.response || "No response data",
        status: axiosError.response?.status || "No status",
      }
      errorMessage = errorData?.message || axiosError.message || errorMessage
    }

    console.error("getPaymentStatus error:", errorDetails)
    throw new Error(errorMessage)
  }
}

export const getPaymentHistory = async (): Promise<PaymentHistoryResponse> => {
  try {
    const token = getAuthToken()
    console.log(
      "Token in getPaymentHistory:",
      token ? `Present: ${token.slice(0, 10)}...` : "Missing"
    )
    if (!token) {
      console.error("No access_token found for getPaymentHistory")
      throw new Error("Vui lòng đăng nhập để xem lịch sử thanh toán")
    }
    console.log("Fetching payment history")
    const res = await axiosJWT.get("/payments/history")
    console.log("getPaymentHistory response:", res.data)
    return res.data
  } catch (error: any) {
    const isAxiosError = axios.isAxiosError(error)
    let errorMessage = "Lỗi khi lấy lịch sử thanh toán."
    let errorDetails: any = {
      message: error.message || "Unknown error",
      response: error.response?.data || "No response data",
      status: error.response?.status || "No status",
      requestUrl: error.config?.url || "Unknown URL",
    }

    if (isAxiosError) {
      const axiosError = error as AxiosError
      const errorData = axiosError.response?.data as
        | { status?: string; message?: string }
        | undefined
      errorDetails = {
        ...errorDetails,
        message: errorData?.message || axiosError.message || "Unknown error",
        response: errorData || axiosError.response || "No response data",
        status: axiosError.response?.status || "No status",
      }
      errorMessage = errorData?.message || axiosError.message || errorMessage
    }

    console.error("getPaymentHistory error:", errorDetails)
    throw new Error(errorMessage)
  }
}
