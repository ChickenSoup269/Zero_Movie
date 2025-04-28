/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TicketPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  // Lấy thông tin booking từ localStorage
  useEffect(() => {
    const pendingBooking = localStorage.getItem("pendingBooking")
    if (pendingBooking) {
      const booking = JSON.parse(pendingBooking)
      setBookingDetails(booking)
      // Hiển thị toast thành công khi vào trang
      toast({
        title: "Thanh toán thành công",
        description: "Vé của bạn đã được đặt thành công!",
        variant: "default",
      })
    } else {
      // Nếu không có booking, chuyển về trang chủ
      router.push("/")
    }
  }, [router, toast])

  const handleConfirm = () => {
    // Xóa dữ liệu booking
    localStorage.removeItem("pendingBooking")
    localStorage.removeItem("returnUrl")
    // Chuyển về trang chủ
    router.push("/")
  }

  if (!bookingDetails) {
    return <div className="text-white text-center py-10">Đang tải...</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-800 text-white border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              Thanh toán thành công
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-400">
              Vé của bạn đã được đặt thành công! Vui lòng kiểm tra email hoặc
              tài khoản của bạn để xem chi tiết.
            </p>
            {bookingDetails && (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Ghế:</span>{" "}
                  {bookingDetails.selectedSeats?.join(", ") || "N/A"}
                </p>
              </div>
            )}
            <Button
              onClick={handleConfirm}
              className="w-full bg-[#4599e3] text-white hover:bg-[#3a82c2] mt-4"
            >
              Xác nhận và về trang chủ
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
