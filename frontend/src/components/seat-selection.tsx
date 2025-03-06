"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import React from "react"

// Hàm khởi tạo ghế ngẫu nhiên
const initializeSeats = () => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
  const cols = Array.from({ length: 18 }, (_, i) => i + 1)
  return rows.reduce((acc, row) => {
    acc[row] = cols.reduce((colAcc, col) => {
      colAcc[col] = Math.random() > 0.3 ? null : "sold" // 30% ghế ngẫu nhiên thành "sold"
      return colAcc
    }, {} as Record<number, string | null>)
    return acc
  }, {} as Record<string, Record<number, string | null>>)
}

const SeatSelection = () => {
  const router = useRouter()

  // Khởi tạo trạng thái ghế
  const [seats, setSeats] =
    useState<Record<string, Record<number, string | null>>>(initializeSeats)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [showLimitDialog, setShowLimitDialog] = useState(false)
  const maxSeats = 8 // Giới hạn 8 ghế
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
  const cols = Array.from({ length: 18 }, (_, i) => i + 1)

  // Tính tổng số ghế, ghế sold, và ghế available
  const totalSeats = 8 * 18 // 8 hàng x 18 ghế = 144 ghế
  const soldSeats = Object.values(seats).reduce(
    (acc, row) =>
      acc + Object.values(row).filter((status) => status === "sold").length,
    0
  )
  const availableSeats = totalSeats - soldSeats - selectedSeats.length

  // Xử lý chọn ghế
  const handleSeatClick = (row: string, col: number) => {
    const seatKey = `${row}${col}`
    if (seats[row][col] === "sold") return // Không cho chọn ghế đã bán

    if (selectedSeats.includes(seatKey)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatKey))
      setSeats((prev) => ({
        ...prev,
        [row]: { ...prev[row], [col]: null },
      }))
    } else if (selectedSeats.length < maxSeats) {
      setSelectedSeats([...selectedSeats, seatKey])
      setSeats((prev) => ({
        ...prev,
        [row]: { ...prev[row], [col]: "selected" },
      }))
    } else {
      // Hiển thị popup nếu vượt quá giới hạn
      setShowLimitDialog(true)
    }
  }

  // Xử lý khi xác nhận ghế
  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!")
      return
    }
    console.log("Selected seats:", selectedSeats)
    router.push(`/booking/confirm?seats=${selectedSeats.join(",")}`)
  }

  // Quay lại trang trước
  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
      {/* Button quay lại */}
      <div className="w-full max-w-4xl flex justify-start mb-4">
        <Button
          variant="ghost"
          className="p-2 text-white hover:bg-gray-700"
          onClick={handleBack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </Button>
      </div>

      {/* Screen */}
      <div className="w-full max-w-4xl bg-white text-black text-center py-8 rounded-lg mb-8 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        SCREEN
      </div>

      {/* Seat Layout */}
      <div className="relative w-full max-w-4xl">
        {/* Ghế chia thành 3 khu vực */}
        {rows.map((row) => (
          <div key={row} className="flex items-center mb-2">
            {/* Nhãn hàng (bên trái) */}
            <span className="w-8 text-sm">{row}</span>

            {/* Khu vực 1: Cột 1-4 */}
            <div className="flex gap-2">
              {cols.slice(0, 4).map((col) => {
                const seatKey = `${row}${col}`
                const isSelected = selectedSeats.includes(seatKey)
                const isSold = seats[row][col] === "sold"
                const seatClass = `w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-green-500"
                    : isSold
                    ? "bg-yellow-500"
                    : "bg-gray-600 hover:bg-gray-500"
                }`

                return (
                  <div
                    key={`${row}-${col}`}
                    className={seatClass}
                    onClick={() => handleSeatClick(row, col)}
                  >
                    {col}
                  </div>
                )
              })}
            </div>

            {/* Khoảng cách giữa các khu vực */}
            <div className="w-4" />

            {/* Khu vực 2: Cột 5-12 */}
            <div className="flex gap-2">
              {cols.slice(4, 12).map((col) => {
                const seatKey = `${row}${col}`
                const isSelected = selectedSeats.includes(seatKey)
                const isSold = seats[row][col] === "sold"
                const seatClass = `w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-green-500"
                    : isSold
                    ? "bg-yellow-500"
                    : "bg-gray-600 hover:bg-gray-500"
                }`

                return (
                  <div
                    key={`${row}-${col}`}
                    className={seatClass}
                    onClick={() => handleSeatClick(row, col)}
                  >
                    {col}
                  </div>
                )
              })}
            </div>

            {/* Khoảng cách giữa các khu vực */}
            <div className="w-4" />

            {/* Khu vực 3: Cột 13-18 */}
            <div className="flex gap-2">
              {cols.slice(12, 18).map((col) => {
                const seatKey = `${row}${col}`
                const isSelected = selectedSeats.includes(seatKey)
                const isSold = seats[row][col] === "sold"
                const seatClass = `w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-green-500"
                    : isSold
                    ? "bg-yellow-500"
                    : "bg-gray-600 hover:bg-gray-500"
                }`

                return (
                  <div
                    key={`${row}-${col}`}
                    className={seatClass}
                    onClick={() => handleSeatClick(row, col)}
                  >
                    {col}
                  </div>
                )
              })}
            </div>

            {/* Nhãn hàng (bên phải) */}
            <span className="w-8 text-sm text-right">{row}</span>
          </div>
        ))}

        {/* Note và Buttons */}
        <div className="flex justify-between items-center mt-6 text-sm">
          <div>
            <p>Total seats: {totalSeats}</p>
            <p>Sold: {soldSeats}</p>
            <p>Available: {availableSeats}</p>
            <p>note: select up to {maxSeats} seats</p>
            <p>
              Selected: {selectedSeats.length} / {maxSeats}
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="bg-gray-800 text-white hover:bg-gray-700"
            >
              Entrance
            </Button>
            <Button
              variant="outline"
              className="bg-gray-800 text-white hover:bg-gray-700"
            >
              3D View
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Confirm
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>User select</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Sold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <span>Available</span>
          </div>
        </div>
      </div>

      {/* Popup thông báo giới hạn */}
      <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <DialogContent className="bg-white text-black">
          <DialogHeader>
            <DialogTitle>Seat Selection Limit Reached</DialogTitle>
            <DialogDescription>
              You have already selected the maximum of {maxSeats} seats. Please
              deselect a seat to choose another one, or proceed to confirm your
              booking.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowLimitDialog(false)}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              Close
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Confirm Selection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SeatSelection
