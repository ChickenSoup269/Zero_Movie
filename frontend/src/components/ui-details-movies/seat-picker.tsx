/* eslint-disable prefer-const */
import { motion } from "framer-motion"
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react"

interface Seat {
  row: string
  number: number
  type: "available" | "sold" | "user-select"
}

interface SeatPickerProps {
  selectedRoom: string
  selectionMode: "single" | "pair" | "group4"
  onSeatsChange: (selectedSeats: string[], soldSeats: string[]) => void
}

// Define the type for the ref object
interface SeatPickerRef {
  markSeatsAsSold: () => void
}

// Use React.forwardRef with proper typing
const SeatPicker = forwardRef<SeatPickerRef, SeatPickerProps>(
  ({ selectedRoom, selectionMode, onSeatsChange }, ref) => {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([])
    const [soldSeats, setSoldSeats] = useState<string[]>([])
    const [hoveredSeats, setHoveredSeats] = useState<string[]>([])

    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
    const seatsPerRow = 18

    // Tạo dữ liệu ghế dựa trên selectedRoom
    const seatsData = rows.map((row) => ({
      row,
      seats: Array(seatsPerRow)
        .fill(null)
        .map((_, i) => {
          const seatNumber = i + 1
          const seatId = `${row}${seatNumber}`
          let isSold = false

          if (soldSeats.includes(seatId)) {
            isSold = true
          } else if (selectedRoom === "C1") {
            isSold = seatNumber <= 5
          } else if (selectedRoom === "C2") {
            isSold = seatNumber >= 14
          } else if (selectedRoom === "C3") {
            isSold = seatNumber >= 7 && seatNumber <= 12
          }

          return {
            row,
            number: seatNumber,
            type: isSold
              ? "sold"
              : selectedSeats.includes(seatId)
              ? "user-select"
              : "available",
          } as Seat
        }),
    }))

    // Cập nhật selectedSeats và soldSeats cho SeatSelection
    useEffect(() => {
      onSeatsChange(selectedSeats, soldSeats)
    }, [selectedSeats, soldSeats, onSeatsChange])

    const handleSeatClick = (seat: Seat) => {
      if (seat.type === "sold") return

      const seatId = `${seat.row}${seat.number}`
      const seatsToSelect =
        selectionMode === "single" ? 1 : selectionMode === "pair" ? 2 : 4
      const rowSeats = seatsData.find((r) => r.row === seat.row)?.seats || []
      const startIndex = seat.number - 1

      if (selectedSeats.includes(seatId)) {
        let seatsToRemove: string[] = []
        for (let i = 0; i < seatsToSelect; i++) {
          const currentIndex = startIndex + i
          if (currentIndex >= rowSeats.length) break

          const currentSeat = rowSeats[currentIndex]
          const currentSeatId = `${currentSeat.row}${currentSeat.number}`
          if (selectedSeats.includes(currentSeatId)) {
            seatsToRemove.push(currentSeatId)
          }
        }
        setSelectedSeats((prev) =>
          prev.filter((id) => !seatsToRemove.includes(id))
        )
        return
      }

      if (selectedSeats.length + seatsToSelect > 8) {
        alert("You can only select up to 8 seats!")
        return
      }

      let seatsToAdd: string[] = []
      for (let i = 0; i < seatsToSelect; i++) {
        const currentIndex = startIndex + i
        if (currentIndex >= rowSeats.length) break

        const currentSeat = rowSeats[currentIndex]
        if (currentSeat.type === "sold") break

        const currentSeatId = `${currentSeat.row}${currentSeat.number}`
        if (!selectedSeats.includes(currentSeatId)) {
          seatsToAdd.push(currentSeatId)
        }
      }

      if (seatsToAdd.length < seatsToSelect) {
        alert(`Không đủ ${seatsToSelect} ghế liền kề khả dụng!`)
        return
      }

      setSelectedSeats([...selectedSeats, ...seatsToAdd])
    }

    const handleMouseEnter = (seat: Seat) => {
      if (seat.type === "sold") return

      const seatsToSelect =
        selectionMode === "single" ? 1 : selectionMode === "pair" ? 2 : 4
      const rowSeats = seatsData.find((r) => r.row === seat.row)?.seats || []
      const startIndex = seat.number - 1
      let seatsToHighlight: string[] = []

      for (let i = 0; i < seatsToSelect; i++) {
        const currentIndex = startIndex + i
        if (currentIndex >= rowSeats.length) break

        const currentSeat = rowSeats[currentIndex]
        if (currentSeat.type === "sold") break

        const currentSeatId = `${currentSeat.row}${currentSeat.number}`
        seatsToHighlight.push(currentSeatId)
      }

      if (seatsToHighlight.length === seatsToSelect) {
        setHoveredSeats(seatsToHighlight)
      } else {
        setHoveredSeats([])
      }
    }

    const handleMouseLeave = () => {
      setHoveredSeats([])
    }

    // Hàm để đánh dấu ghế đã chọn là đã bán
    const markSeatsAsSold = () => {
      setSoldSeats((prev) => [...prev, ...selectedSeats])
      setSelectedSeats([])
    }

    // Expose markSeatsAsSold thông qua ref
    useImperativeHandle(ref, () => ({
      markSeatsAsSold,
    }))

    return (
      <div className="w-3/3 shadow-lg pl-14">
        <div className="relative flex justify-center">
          {/* Glow Effect Background */}
          <motion.div
            className="absolute w-[600px] h-[50px] top-0 bg-blue-500 blur-3xl opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
          />

          {/* Main Screen */}
          <motion.div
            className="w-[600px] h-[120px] relative"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="absolute w-full h-full border-t-[15px] border-blue-400"
              style={{
                borderRadius: "80% / 100px 100px 0 0",
                transform: "perspective(300px) rotateX(20deg)",
                clipPath: "inset(0 0 30% 0)",
              }}
            />

            {/* Glow Elements */}
            <motion.div
              className="absolute top-0 left-1/4 w-1/2 h-[2px] bg-blue-300 blur-sm"
              animate={{
                opacity: [0.8, 0.2, 0.8],
                boxShadow: "0 0 20px 5px rgba(104, 190, 255, 0.7)",
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Screen Text */}
          <motion.div
            className="absolute bottom-6 text-white text-2xl font-bold tracking-widest"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              textShadow: "0 0 10px rgba(69, 153, 227, 0.7)",
            }}
            transition={{ delay: 0.5 }}
          >
            SCREEN
          </motion.div>
        </div>

        <div className="grid gap-2">
          {seatsData.map((row) => (
            <div key={row.row} className="flex items-center gap-2">
              <span className="text-gray-400 w-5">{row.row}</span>
              <div className="flex gap-1 flex-1 justify-center">
                {row.seats.map((seat) => {
                  const seatId = `${seat.row}${seat.number}`
                  const isSelected = selectedSeats.includes(seatId)
                  const isHovered = hoveredSeats.includes(seatId)

                  return (
                    <React.Fragment key={seatId}>
                      {(seat.number === 6 || seat.number === 14) && (
                        <div className="w-4" />
                      )}
                      <motion.button
                        onClick={() => handleSeatClick(seat)}
                        onMouseEnter={() => handleMouseEnter(seat)}
                        onMouseLeave={handleMouseLeave}
                        className={`w-8 h-8 rounded-sm text-sm ${
                          seat.type === "sold"
                            ? "bg-gray-600 cursor-not-allowed"
                            : isSelected
                            ? "bg-blue-400 rounded-bl-[40%] rounded-br-[40%]"
                            : "bg-white"
                        }`}
                        initial={{ scale: 1, opacity: 1, rotate: 0 }}
                        animate={{
                          scale: isSelected ? 1.1 : isHovered ? 0.95 : 1,
                          opacity: seat.type === "sold" ? 0.6 : 1,
                          color: isSelected ? "white" : "black",
                          border: isHovered ? "2px solid #4599e3" : "none",
                          backgroundColor: isSelected ? "#4599e3" : "white",
                          boxShadow: isSelected
                            ? "0px 0px 8px rgba(69, 153, 227, 0.8)"
                            : isHovered
                            ? "0px 0px 10px rgba(255, 255, 255, 0.3)"
                            : "0px 0px 0px rgba(0, 0, 0, 0)",
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        whileTap={{ scale: seat.type !== "sold" ? 0.95 : 1 }}
                      >
                        {seat.type === "sold" ? "" : seat.number}
                      </motion.button>
                    </React.Fragment>
                  )
                })}
              </div>
              <span className="text-gray-400 w-5">{row.row}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-5 mt-5 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-400 rounded-sm"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
            <span>Taken</span>
          </div>
        </div>
      </div>
    )
  }
)

// Add display name for better debugging
SeatPicker.displayName = "SeatPicker"

export default SeatPicker
