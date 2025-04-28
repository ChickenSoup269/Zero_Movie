"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { capturePayment } from "@/services/paymentService"
import { deleteBooking } from "@/services/bookingService"
import {
  getSeatsByShowtime,
  updateSeatStatus,
} from "@/services/showtimeSeatService"
import { Loader2 } from "lucide-react"
import axios from "axios"

// Define types
interface Seat {
  id: string // Changed from _id to match ShowtimeSeat
  seatNumber: string
  showtimeId: string
  seatId: string
  status: "available" | "reserved" | "booked"
}

interface SeatResponse {
  seats: Seat[]
}

interface Payment {
  status: string
}

interface CaptureResponse {
  payment: Payment
}

export default function TicketPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handlePaymentCapture = async () => {
      const token = searchParams.get("token")
      const payerId = searchParams.get("PayerID")

      if (!token || !payerId) {
        setError("Thiếu thông tin thanh toán.")
        toast({
          title: "Lỗi",
          description: "Thiếu thông tin thanh toán.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      let pendingBooking: any = null
      try {
        setError(null)
        pendingBooking = JSON.parse(
          localStorage.getItem("pendingBooking") || "{}"
        )
        console.log("Retrieved pendingBooking:", pendingBooking)

        const { showtimeId, selectedSeats, bookingId } = pendingBooking

        // Detailed validation
        if (
          !showtimeId ||
          !bookingId ||
          !selectedSeats ||
          !Array.isArray(selectedSeats)
        ) {
          const missingFields = []
          if (!showtimeId) missingFields.push("showtimeId")
          if (!bookingId) missingFields.push("bookingId")
          if (!selectedSeats || !Array.isArray(selectedSeats))
            missingFields.push("selectedSeats")
          throw new Error(
            `Trạng thái đặt vé không hợp lệ! Thiếu các trường: ${missingFields.join(
              ", "
            )}`
          )
        }

        // Kiểm tra lại ghế trước khi capture
        const seatResponse: SeatResponse = await getSeatsByShowtime(showtimeId)
        console.log("seatResponse before capture:", seatResponse)
        if (!seatResponse.seats || seatResponse.seats.length === 0) {
          throw new Error("Không có ghế khả dụng cho suất chiếu này.")
        }
        const invalidSeats = selectedSeats.filter(
          (seatNumber: string) =>
            !seatResponse.seats.find(
              (s: Seat) =>
                s.seatNumber === seatNumber && s.status === "available"
            )
        )
        if (invalidSeats.length > 0) {
          throw new Error(`Ghế ${invalidSeats.join(", ")} không còn khả dụng.`)
        }

        // Capture payment
        let captureResponse: CaptureResponse | undefined
        let paymentRetryCount = 0
        const maxPaymentRetries = 3
        while (paymentRetryCount < maxPaymentRetries) {
          try {
            console.log("Capturing payment with token:", token)
            captureResponse = await capturePayment({ token })
            console.log("captureResponse:", captureResponse)
            break
          } catch (captureError) {
            console.error(
              `Failed to capture payment (attempt ${paymentRetryCount + 1}):`,
              {
                message: (captureError as Error).message,
                response: (captureError as any).response?.data,
                status: (captureError as any).response?.status,
              }
            )
            paymentRetryCount++
            if (paymentRetryCount === maxPaymentRetries) {
              throw new Error(
                (captureError as any).response?.data?.message ||
                  "Không thể xác nhận thanh toán sau nhiều lần thử."
              )
            }
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        }

        if (
          !captureResponse?.payment ||
          captureResponse.payment.status !== "completed"
        ) {
          throw new Error("Thanh toán chưa được hoàn tất!")
        }

        // Cập nhật trạng thái ghế
        for (const seatNumber of selectedSeats) {
          const seat = seatResponse.seats.find(
            (s: Seat) => s.seatNumber === seatNumber
          )
          if (seat) {
            let seatRetryCount = 0
            const maxSeatRetries = 3
            while (seatRetryCount < maxSeatRetries) {
              try {
                console.log(
                  `Updating seat ${seat.seatNumber} (id: ${seat.id}) to booked`
                )
                await updateSeatStatus(showtimeId, seat.id, {
                  status: "booked",
                })
                console.log(`Seat ${seat.seatNumber} updated successfully`)
                break
              } catch (seatError) {
                console.error(
                  `Failed to update seat ${seat.seatNumber} (attempt ${
                    seatRetryCount + 1
                  }):`,
                  {
                    message: (seatError as Error).message,
                    response: (seatError as any).response?.data,
                    status: (seatError as any).response?.status,
                  }
                )
                seatRetryCount++
                if (seatRetryCount === maxSeatRetries) {
                  throw new Error(
                    `Failed to update seat ${seat.seatNumber} after ${maxSeatRetries} attempts`
                  )
                }
                await new Promise((resolve) => setTimeout(resolve, 1000))
              }
            }
          } else {
            console.warn(`Seat ${seatNumber} not found in seatResponse`)
          }
        }

        // Update booking status to confirmed
        let bookingRetryCount = 0
        const maxBookingRetries = 3
        while (bookingRetryCount < maxBookingRetries) {
          try {
            console.log("Updating booking status to confirmed:", bookingId)
            await axios.patch(
              `/api/bookings/${bookingId}`,
              { status: "confirmed" },
              { headers: { Authorization: `Bearer ${getAuthToken()}` } }
            )
            console.log("Booking status updated to confirmed")
            break
          } catch (bookingError) {
            console.error(
              `Failed to update booking status (attempt ${
                bookingRetryCount + 1
              }):`,
              {
                message: (bookingError as Error).message,
                response: (bookingError as any).response?.data,
                status: (bookingError as any).response?.status,
              }
            )
            bookingRetryCount++
            if (bookingRetryCount === maxBookingRetries) {
              console.warn(
                `Failed to update booking status after ${maxBookingRetries} attempts`
              )
              break
            }
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        }

        // Clean up and redirect
        const returnUrl = localStorage.getItem("returnUrl") || "/ticket"
        localStorage.removeItem("pendingBooking")
        localStorage.removeItem("returnUrl")
        localStorage.setItem("paymentSuccess", "true")
        router.push(returnUrl)
      } catch (error) {
        console.error("Lỗi trong handlePaymentCapture:", {
          message: (error as Error).message,
          response: (error as any).response?.data,
          status: (error as any).response?.status,
        })
        setError((error as Error).message || "Không thể xác nhận thanh toán.")
        toast({
          title: "Lỗi",
          description:
            (error as Error).message || "Không thể xác nhận thanh toán.",
          variant: "destructive",
        })
        if (pendingBooking?.bookingId) {
          await deleteBooking(pendingBooking.bookingId)
        }
        localStorage.removeItem("pendingBooking")
        localStorage.removeItem("returnUrl")
        setIsLoading(false)
      }
    }

    handlePaymentCapture()
  }, [router, searchParams, toast])

  // Show success toast on the redirected page
  useEffect(() => {
    if (localStorage.getItem("paymentSuccess")) {
      toast({
        title: "Thành công",
        description: "Thanh toán hoàn tất, vé đã được đặt!",
        variant: "default",
      })
      localStorage.removeItem("paymentSuccess")
    }
  }, [toast])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang xử lý thanh toán...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return null
}
