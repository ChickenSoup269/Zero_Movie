import { motion } from "framer-motion"
import React from "react"

interface Seat {
  row: string
  number: number
  type: "available" | "sold" | "user-select"
}

interface SeatPickerProps {
  seatsData: { row: string; seats: Seat[] }[]
  selectedSeats: string[]
  hoveredSeats: string[]
  handleSeatClick: (seat: Seat) => void
  handleMouseEnter: (seat: Seat) => void
  handleMouseLeave: () => void
}

const SeatPicker = ({
  seatsData,
  selectedSeats,
  hoveredSeats,
  handleSeatClick,
  handleMouseEnter,
  handleMouseLeave,
}: SeatPickerProps) => {
  return (
    <div className="w-2/3">
      <div className="relative mb-5 text-center text-gray-400 text-xl font-bold">
        <motion.div
          className="absolute top-0 left-0 right-0 h-4 bg-transparent border-t-2 border-blue-400"
          style={{ borderRadius: "100% 100% 0 0" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: 1,
            y: 0,
            boxShadow: "0px 0px 15px rgba(69, 153, 227, 0.8)",
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ boxShadow: "0px 0px 20px rgba(69, 153, 227, 1)" }}
        />
        <div className="pt-6">SCREEN</div>
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
                          ? "bg-[#ffffff] cursor-not-allowed"
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

export default SeatPicker
