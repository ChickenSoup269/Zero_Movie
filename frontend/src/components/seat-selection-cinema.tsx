/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, SetStateAction } from "react"
import { format, addDays, subDays, isSameDay } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Ticket from "./ui-details-movies/ticket"

interface Seat {
  row: string
  number: number
  type: "available" | "sold" | "user-select"
}

interface MovieInfo {
  type: string
  movieTitle: string
  director: string
}

interface Theater {
  id: number
  name: string
  image: string
  address: string
  phone: string
  description: string
  mapUrl: string
}

interface SeatSelectionProps {
  movieInfo: MovieInfo
  theaters: Theater[]
}

const SeatSelection = ({ movieInfo, theaters }: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [ticketCount, setTicketCount] = useState(0)
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [ticketId, setTicketId] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("18:00")
  const [selectedType, setSelectedType] = useState<string>("2D")
  const [selectedRoom, setSelectedRoom] = useState<string>("C1")
  const [selectedTheater, setSelectedTheater] = useState<Theater>(theaters[0])

  const timeOptions = ["18:00", "20:00", "22:00"]
  const typeOptions = ["2D", "3D", "IMAX"]
  const roomOptions = ["C1", "C2", "C3"]
  const [selectionMode, setSelectionMode] = useState<
    "single" | "pair" | "group4"
  >("single")
  const [hoveredSeats, setHoveredSeats] = useState<string[]>([])

  const generateTicketId = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "0123456789"
    const randomLetters =
      letters[Math.floor(Math.random() * letters.length)] +
      letters[Math.floor(Math.random() * letters.length)]
    const randomNumbers =
      numbers[Math.floor(Math.random() * numbers.length)] +
      numbers[Math.floor(Math.random() * numbers.length)] +
      numbers[Math.floor(Math.random() * numbers.length)]
    return `${randomLetters}${randomNumbers}`
  }

  useEffect(() => {
    if (selectedSeats.length === 1 && ticketId === "") {
      const newTicketId = generateTicketId()
      setTicketId(newTicketId)
    } else if (selectedSeats.length === 0) {
      setTicketId("")
    }
  }, [selectedSeats, ticketId])

  useEffect(() => {
    setTicketCount(selectedSeats.length)
  }, [selectedSeats])

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"] // 8 hàng từ A đến H
  const seatsPerRow = 18 // Tổng cộng ghế mỗi hàng

  const seatsData = rows.map((row) => ({
    row,
    seats: Array(seatsPerRow)
      .fill(null)
      .map((_, i) => {
        const seatNumber = i + 1
        let isSold = false
        if (selectedRoom === "C1") {
          isSold = seatNumber <= 5
        } else if (selectedRoom === "C2") {
          isSold = seatNumber >= 14
        } else if (selectedRoom === "C3") {
          isSold = seatNumber >= 7 && seatNumber <= 12
        }
        return {
          row,
          number: seatNumber,
          type: isSold ? "sold" : "available",
        } as Seat
      }),
  }))

  const handleSeatClick = (seat: Seat) => {
    if (seat.type === "sold") return

    const seatId = `${seat.row}${seat.number}`
    let newSelectedSeats = [...selectedSeats]

    // Nếu ghế đã được chọn, bỏ chọn ghế đó và các ghế liên quan
    if (selectedSeats.includes(seatId)) {
      newSelectedSeats = newSelectedSeats.filter((id) => id !== seatId)
      setSelectedSeats(newSelectedSeats)
      return
    }

    // Tính số ghế cần chọn dựa trên chế độ
    const seatsToSelect =
      selectionMode === "single" ? 1 : selectionMode === "pair" ? 2 : 4

    // Kiểm tra giới hạn 6 ghế
    if (selectedSeats.length + seatsToSelect > 6) {
      alert("Bạn chỉ có thể chọn tối đa 6 ghế!")
      return
    }

    // Tìm các ghế liền kề
    const rowSeats = seatsData.find((r) => r.row === seat.row)?.seats || []
    const startIndex = seat.number - 1 // Chỉ số bắt đầu (seat.number bắt đầu từ 1)
    let seatsToAdd: string[] = []

    // Kiểm tra các ghế liền kề có khả dụng không
    for (let i = 0; i < seatsToSelect; i++) {
      const currentIndex = startIndex + i
      if (currentIndex >= rowSeats.length) break // Vượt quá số ghế trong hàng

      const currentSeat = rowSeats[currentIndex]
      if (currentSeat.type === "sold") break // Ghế đã bán, dừng lại

      const currentSeatId = `${currentSeat.row}${currentSeat.number}`
      if (!selectedSeats.includes(currentSeatId)) {
        seatsToAdd.push(currentSeatId)
      }
    }

    // Nếu không đủ ghế liền kề khả dụng, thông báo lỗi
    if (seatsToAdd.length < seatsToSelect) {
      alert(`Không đủ ${seatsToSelect} ghế liền kề khả dụng!`)
      return
    }

    // Thêm các ghế vào danh sách đã chọn
    setSelectedSeats([...selectedSeats, ...seatsToAdd])
  }

  const today = new Date()
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  const getWeekDates = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(today) // Luôn bắt đầu từ ngày hôm nay
      date.setDate(today.getDate() + i) // Tăng dần từ ngày hôm nay

      const day = date.getDate().toString().padStart(2, "0")
      const month = months[date.getMonth()]
      const dayOfWeek = daysOfWeek[date.getDay()]
      const isToday = isSameDay(date, today)
      const isSunday = date.getDay() === 0 // Chủ nhật là ngày 0
      const isSelected = selectedDate && isSameDay(date, selectedDate)
      dates.push({ day, month, dayOfWeek, isToday, isSunday, isSelected, date })
    }
    return dates
  }

  const weekDates = getWeekDates()

  const handlePrevWeek = () => {
    // Không cho phép quay lại tuần trước (vì không hiển thị ngày đã qua)
  }

  const handleNextWeek = () => {
    const newStart = addDays(currentWeekStart, 7)
    setCurrentWeekStart(newStart)
    setSelectedDate(undefined) // Reset ngày chọn khi chuyển tuần
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    // Không cần điều chỉnh currentWeekStart vì luôn hiển thị từ today
  }

  // Phần JSX cho lịch
  const renderDatePicker = () => (
    <div className="flex gap-2 items-center">
      <div className="text-gray-400">Date:</div>
      <button
        onClick={handlePrevWeek}
        className="text-gray-400 hover:text-white"
        disabled // Vô hiệu hóa nút Prev vì không hiển thị ngày đã qua
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div className="flex gap-1">
        {weekDates.map((date, index) => (
          <motion.button
            key={index}
            onClick={() => handleDateClick(date.date)}
            className={`px-3 py-2 rounded-full text-sm font-medium flex flex-col items-center justify-center ${
              date.isSelected
                ? "bg-[#4599e3] text-white"
                : date.isToday
                ? "bg-[#4599e3] text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: date.isSelected || date.isToday ? 1.1 : 1,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              delay: index * 0.05,
            }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xs">{date.month}</span>
            <span className="text-base font-bold">
              {date.isToday && !date.isSelected ? "Today" : date.day}
            </span>
            <span className="text-xs">{date.dayOfWeek}</span>
          </motion.button>
        ))}
      </div>
      <button
        onClick={handleNextWeek}
        className="text-gray-400 hover:text-white"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="ml-2 bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={(date) => {
              if (date && date >= today) {
                // Chỉ cho phép chọn từ hôm nay trở đi
                setSelectedDate(date)
              }
            }}
            disabled={(date) => date < today} // Vô hiệu hóa các ngày trước hôm nay
            initialFocus
            className="bg-gray-800 text-white border-gray-700"
          />
        </PopoverContent>
      </Popover>
    </div>
  )

  // hàm chọn ghế hover select
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

    // Chỉ highlight nếu đủ số ghế liền kề
    if (seatsToHighlight.length === seatsToSelect) {
      setHoveredSeats(seatsToHighlight)
    } else {
      setHoveredSeats([])
    }
  }

  const handleMouseLeave = () => {
    setHoveredSeats([])
  }

  return (
    <div className="mt-10 p-6 rounded-lg">
      <div className="flex flex-wrap gap-4 items-center mb-6">
        {/* Phần chọn lịch */}
        <div className="flex gap-2 items-center">
          <div className="text-gray-400">Date:</div>
          <button
            onClick={handlePrevWeek}
            className="text-gray-400 hover:text-white"
            disabled // Vô hiệu hóa nút Prev vì không hiển thị ngày đã qua
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex gap-1">
            {weekDates.map((date, index) => (
              <motion.button
                key={index}
                onClick={() => handleDateClick(date.date)}
                className={`px-3 py-4 rounded-xl text-sm font-medium flex flex-col items-center justify-center  ${
                  date.isSelected
                    ? "bg-[#4599e3] text-white" // Ngày được chọn: nền xanh, chữ trắng
                    : date.isToday
                    ? "border-2 border-dotted border-[#4599e3] text-[#4599e3] bg-white" // Hôm nay: border chấm, text xanh, nền xám
                    : date.isSunday
                    ? "border-2 border-red-500 text-red-500 bg-gray-700" // Chủ nhật: border đỏ, text đỏ
                    : "bg-gray-700 text-white hover:bg-blue-400 duration-300" // Các ngày khác
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: date.isSelected || date.isToday ? 1 : 0.9,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                whileHover={{ scale: 0.85 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xs">{date.month}</span>
                <span className="text-base font-bold">{date.day}</span>
                <span className="text-xs">{date.dayOfWeek}</span>
              </motion.button>
            ))}
          </div>
          <button
            onClick={handleNextWeek}
            className="text-gray-400 hover:text-white"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="ml-2 bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {selectedDate
                  ? format(selectedDate, "dd MMM yyyy")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date && date >= today) {
                    // Chỉ cho phép chọn từ hôm nay trở đi
                    setSelectedDate(date)
                  }
                }}
                disabled={(date) => date < today} // Vô hiệu hóa các ngày trước hôm nay
                initialFocus
                className="bg-gray-800 text-white border-gray-700"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* time */}
        <div className="flex items-center gap-2">
          <label className="text-gray-400">Time:</label>
          <motion.select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 rounded px-3 py-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </motion.select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-400">Type:</label>
          <motion.select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 rounded px-3 py-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </motion.select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-400">Room:</label>
          <motion.select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 rounded px-3 py-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            {roomOptions.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </motion.select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-400">Cinema:</label>
          <motion.select
            value={selectedTheater.id}
            onChange={(e) => {
              const theater = theaters.find(
                (t) => t.id === parseInt(e.target.value)
              )
              if (theater) setSelectedTheater(theater)
            }}
            className="bg-gray-700 text-white border-gray-600 rounded px-3 py-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            {theaters.map((theater) => (
              <option key={theater.id} value={theater.id}>
                {theater.name}
              </option>
            ))}
          </motion.select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-400">Select Mode:</label>
          <motion.select
            value={selectionMode}
            onChange={(e) =>
              setSelectionMode(e.target.value as "single" | "pair" | "group4")
            }
            className="bg-gray-700 text-white border-gray-600 rounded px-3 py-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <option value="single">Single</option>
            <option value="pair">Pair (2 seats)</option>
            <option value="group4">Group (4 seats)</option>
          </motion.select>
        </div>
      </div>
      {/* phần góc trái chọn vé */}
      <div className="flex gap-6">
        <div className="w-1/3 flex flex-col gap-4">
          <h3 className="text-xl font-bold">Select Your Seats</h3>
          <p className="text-gray-400">
            {ticketCount} / 6 Seats: {selectedSeats.join(", ")}
          </p>
          {ticketCount >= 6 && (
            <p className="text-red-500 text-sm">Đã đạt giới hạn 6 ghế!</p>
          )}
          <Ticket
            theater={selectedTheater}
            movieInfo={movieInfo}
            selectedSeats={selectedSeats}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
            ticketId={ticketId}
            selectedRoom={selectedRoom}
            selectedType={selectedType}
          />
          <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
            BUY
          </button>
        </div>

        {/* ghế */}
        <div className="w-2/3">
          <div className="relative mb-5 text-center text-gray-400 text-xl font-bold">
            <motion.div
              className="absolute top-0 left-0 right-0 h-4 bg-transparent border-t-2 border-blue-400"
              style={{
                borderRadius: "100% 100% 0 0", // Tạo cung tròn phía trên
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
                boxShadow: "0px 0px 15px rgba(69, 153, 227, 0.8)", // Đổ bóng phát sáng cho đường cong
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{
                boxShadow: "0px 0px 20px rgba(69, 153, 227, 1)", // Bóng sáng hơn khi hover
              }}
            />
            <div className="pt-6">SCREEN</div>{" "}
          </div>
          {/* ghế cần fix hover gấp */}
          <div className="grid gap-2">
            {seatsData.map((row, index) => (
              <div key={row.row} className="flex items-center gap-2">
                <span className="text-gray-400 w-5">{row.row}</span>
                <div className="flex gap-1 flex-1 justify-center">
                  {row.seats.map((seat, seatIndex) => {
                    const seatId = `${seat.row}${seat.number}`
                    const isSelected = selectedSeats.includes(seatId)
                    const isHovered = hoveredSeats.includes(seatId)

                    return (
                      <>
                        {/* Thêm khoảng cách lối đi trước ghế 5 và 14 */}
                        {(seat.number === 6 || seat.number === 14) && (
                          <div className="w-4" /> // Khoảng cách lối đi
                        )}
                        <motion.button
                          key={seatId}
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
                      </>
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
      </div>
    </div>
  )
}

export default SeatSelection
