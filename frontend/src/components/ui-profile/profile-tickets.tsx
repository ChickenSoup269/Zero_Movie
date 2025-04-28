/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Ticket, Trash2 } from "lucide-react"
import { ErrorToast } from "@/components/ui-notification/error-toast"
import { SuccessToast } from "@/components/ui-notification/success-toast"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { deleteBooking } from "@/services/bookingService"

const axiosJWT = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
})

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token")
  }
  return null
}

axiosJWT.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

interface ProfileTicketsProps {
  isActive: boolean // Để biết tab tickets có đang được chọn không
}

const ProfileTickets = ({ isActive }: ProfileTicketsProps) => {
  const [tickets, setTickets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const errorToast = ErrorToast({
    title: "Lỗi",
    description: "Không thể tải danh sách vé.",
    duration: 3000,
  })
  const successToast = SuccessToast({
    title: "Thành công!",
    description: "Đã xóa vé thành công.",
    duration: 3000,
  })

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true)
      try {
        const response = await axiosJWT.get("/bookings/my-bookings")
        // Chỉ lấy các booking có trạng thái confirmed
        const filteredTickets = (response.data.bookings || []).filter(
          (ticket: any) => ticket.status === "confirmed"
        )
        setTickets(filteredTickets)
      } catch (error: any) {
        errorToast.showToast({
          description:
            error.response?.data?.message ||
            error.message ||
            "Không thể tải danh sách vé.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    if (isActive) {
      fetchTickets()
    }
  }, [isActive])

  const handleDeleteTicket = async (bookingId: string) => {
    // Xác nhận trước khi xóa
    if (!window.confirm("Bạn có chắc chắn muốn xóa vé này?")) {
      return
    }

    try {
      setIsLoading(true)
      await deleteBooking(bookingId)
      // Cập nhật danh sách tickets sau khi xóa
      setTickets((prev) => prev.filter((ticket) => ticket._id !== bookingId))
      successToast.showToast({
        description: "Đã xóa vé thành công.",
      })
    } catch (error: any) {
      errorToast.showToast({
        description: error.message || "Không thể xóa vé. Vui lòng thử lại.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  }

  return (
    <motion.div
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute w-full py-6"
    >
      <h3 className="text-lg font-medium">Vé của tôi</h3>
      {isLoading ? (
        <p className="text-muted-foreground mt-2">Đang tải vé...</p>
      ) : tickets.length === 0 ? (
        <p className="text-muted-foreground mt-2">Bạn chưa có vé nào.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="p-4 bg-gray-800 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-blue-400" />
                  <h4 className="font-semibold">
                    {ticket.movie?.title || "Phim không xác định"}
                  </h4>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Rạp: {ticket.cinema?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-400">
                  Ghế:{" "}
                  {ticket.seats?.map((s: any) => s.seatNumber).join(", ") ||
                    "N/A"}
                </p>
                <p className="text-sm text-gray-400">
                  Thời gian:{" "}
                  {new Date(ticket.showtime?.startTime).toLocaleString() ||
                    "N/A"}
                </p>
                <p className="text-sm text-gray-400">Mã vé: {ticket._id}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteTicket(ticket._id)}
                disabled={isLoading}
                className="text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default ProfileTickets
