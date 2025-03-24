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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
  const cols = Array.from({ length: 18 }, (_, i) => i + 1)

  const [seats, setSeats] =
    useState<Record<string, Record<number, string | null>>>(initializeSeats)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [hoveredSeats, setHoveredSeats] = useState<string[]>([]) // Ghế đang được hover
  const [showLimitDialog, setShowLimitDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [seatCount, setSeatCount] = useState<number | null>(null) // Mặc định null (tương ứng với chọn 1 ghế)
  const maxSeats = 8 // Giới hạn 8 ghế

  // Tính tổng số ghế, ghế sold, và ghế available
  const totalSeats = 8 * 18 // 8 hàng x 18 ghế = 144 ghế
  const soldSeats = Object.values(seats).reduce(
    (acc, row) =>
      acc + Object.values(row).filter((status) => status === "sold").length,
    0
  )
  const availableSeats = totalSeats - soldSeats - selectedSeats.length

  // Hàm tìm ghế liên tiếp theo hàng ngang
  const findHorizontalSeats = (
    startRow: string,
    startCol: number,
    count: number
  ): string[] | null => {
    const seatsToSelect: string[] = []
    for (let col = startCol; col < startCol + count && col <= 18; col++) {
      const seatKey = `${startRow}${col}`
      if (seats[startRow][col] === "sold" || selectedSeats.includes(seatKey)) {
        return null // Không đủ ghế liên tiếp hoặc đã được chọn
      }
      seatsToSelect.push(seatKey)
    }
    if (seatsToSelect.length === count) return seatsToSelect
    return null
  }

  // Hàm tìm ghế liên tiếp theo hàng dọc
  const findVerticalSeats = (
    startRow: string,
    startCol: number,
    count: number
  ): string[] | null => {
    const rowIndex = rows.indexOf(startRow)
    const seatsToSelect: string[] = []
    for (let i = 0; i < count && rowIndex + i < rows.length; i++) {
      const row = rows[rowIndex + i]
      const seatKey = `${row}${startCol}`
      if (seats[row][startCol] === "sold" || selectedSeats.includes(seatKey)) {
        return null // Không đủ ghế liên tiếp hoặc đã được chọn
      }
      seatsToSelect.push(seatKey)
    }
    if (seatsToSelect.length === count) return seatsToSelect
    return null
  }

  // Xử lý khi hover vào ghế
  const handleSeatHover = (row: string, col: number) => {
    const seatKey = `${row}${col}`
    if (seats[row][col] === "sold" || selectedSeats.includes(seatKey)) {
      setHoveredSeats([])
      return
    }

    const count = seatCount || 1 // Mặc định chọn 1 ghế nếu seatCount là null
    let seatsToHover = [seatKey]

    if (count > 1) {
      // Thử tìm ghế liên tiếp theo hàng ngang
      let seatsToSelect = findHorizontalSeats(row, col, count)
      if (!seatsToSelect) {
        // Nếu không tìm được ngang, thử dọc
        seatsToSelect = findVerticalSeats(row, col, count)
      }
      seatsToHover = seatsToSelect || [seatKey] // Nếu không tìm được đủ ghế, chỉ hover ghế hiện tại
    }

    setHoveredSeats(seatsToHover)
  }

  // Xử lý khi rời hover
  const handleSeatLeave = () => {
    setHoveredSeats([])
  }

  // Xử lý chọn hoặc xóa ghế
  const handleSeatClick = (row: string, col: number) => {
    const seatKey = `${row}${col}`
    if (seats[row][col] === "sold") return // Không cho chọn ghế đã bán

    // Nếu ghế đã được chọn, xóa nó
    if (selectedSeats.includes(seatKey)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatKey))
      setSeats((prev) => ({
        ...prev,
        [row]: { ...prev[row], [col]: null },
      }))
      return
    }

    const count = seatCount || 1 // Mặc định chọn 1 ghế nếu seatCount là null
    const totalNewSeats = selectedSeats.length + count

    // Kiểm tra giới hạn ghế
    if (totalNewSeats > maxSeats) {
      setShowLimitDialog(true)
      return
    }

    // Nếu chỉ chọn 1 ghế
    if (count === 1) {
      setSelectedSeats([...selectedSeats, seatKey])
      setSeats((prev) => ({
        ...prev,
        [row]: { ...prev[row], [col]: "selected" },
      }))
      return
    }

    // Thử tìm ghế liên tiếp theo hàng ngang
    let seatsToSelect = findHorizontalSeats(row, col, count)
    if (!seatsToSelect) {
      // Nếu không tìm được ngang, thử dọc
      seatsToSelect = findVerticalSeats(row, col, count)
    }

    if (seatsToSelect) {
      setSelectedSeats([...selectedSeats, ...seatsToSelect])
      seatsToSelect.forEach((seat) => {
        const [r, c] = seat.match(/([A-H])(\d+)/)!.slice(1)
        setSeats((prev) => ({
          ...prev,
          [r]: { ...prev[r], [parseInt(c)]: "selected" },
        }))
      })
    } else {
      setShowErrorDialog(true) // Hiển thị thông báo nếu không tìm được ghế liên tiếp
    }
  }

  // Xử lý xóa hết ghế đã chọn
  const handleClearSelection = () => {
    setSelectedSeats([])
    setSeats((prev) => {
      const newSeats = { ...prev }
      selectedSeats.forEach((seat) => {
        const [row, col] = seat.match(/([A-H])(\d+)/)!.slice(1)
        newSeats[row][parseInt(col)] = null
      })
      return newSeats
    })
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
                const isHovered = hoveredSeats.includes(seatKey)
                const seatClass = `w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-green-500"
                    : isSold
                    ? "bg-yellow-500"
                    : isHovered
                    ? "bg-blue-500"
                    : "bg-gray-600 hover:bg-gray-500"
                }`

                return (
                  <div
                    key={`${row}-${col}`}
                    className={seatClass}
                    onClick={() => handleSeatClick(row, col)}
                    onMouseEnter={() => handleSeatHover(row, col)}
                    onMouseLeave={handleSeatLeave}
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
                const isHovered = hoveredSeats.includes(seatKey)
                const seatClass = `w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-green-500"
                    : isSold
                    ? "bg-yellow-500"
                    : isHovered
                    ? "bg-blue-500"
                    : "bg-gray-600 hover:bg-gray-500"
                }`

                return (
                  <div
                    key={`${row}-${col}`}
                    className={seatClass}
                    onClick={() => handleSeatClick(row, col)}
                    onMouseEnter={() => handleSeatHover(row, col)}
                    onMouseLeave={handleSeatLeave}
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
                const isHovered = hoveredSeats.includes(seatKey)
                const seatClass = `w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-green-500"
                    : isSold
                    ? "bg-yellow-500"
                    : isHovered
                    ? "bg-blue-500"
                    : "bg-gray-600 hover:bg-gray-500"
                }`

                return (
                  <div
                    key={`${row}-${col}`}
                    className={seatClass}
                    onClick={() => handleSeatClick(row, col)}
                    onMouseEnter={() => handleSeatHover(row, col)}
                    onMouseLeave={handleSeatLeave}
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
          <div className="flex gap-2 items-center">
            <Select
              onValueChange={(value) => setSeatCount(parseInt(value))}
              defaultValue={seatCount?.toString() || ""}
              //   className="w-24"
            >
              <SelectTrigger className="bg-gray-800 text-white border-gray-600 text-sm h-8">
                <SelectValue placeholder="Seats" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-600">
                <SelectItem value="1">1 seats</SelectItem>
                <SelectItem value="2">2 seats</SelectItem>
                <SelectItem value="3">3 seats</SelectItem>
                <SelectItem value="4">4 seats</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="bg-gray-800 text-white hover:bg-gray-700 h-8 text-sm"
            >
              Entrance
            </Button>
            <Button
              variant="outline"
              className="bg-gray-800 text-white hover:bg-gray-700 h-8 text-sm"
            >
              3D View
            </Button>
            <Button
              onClick={handleClearSelection}
              className="bg-red-600 text-white hover:bg-red-700 h-8 text-sm"
            >
              Clear Selection
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-green-600 text-white hover:bg-green-700 h-8 text-sm"
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

      {/* Popup thông báo không đủ ghế liên tiếp */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="bg-white text-black">
          <DialogHeader>
            <DialogTitle>Not Enough Consecutive Seats</DialogTitle>
            <DialogDescription>
              There are not enough consecutive seats available in this area.
              Please choose a different starting seat or reduce the number of
              seats.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowErrorDialog(false)}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SeatSelection
