import { useState } from "react"
import { format, addDays, subDays, isSameDay } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Seat {
  row: string
  number: number
  type: "available" | "sold" | "user-select"
}

const SeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]) // Ghế đã chọn
  const [ticketCount, setTicketCount] = useState(0) // Số lượng vé
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date()) // Ngày bắt đầu của tuần hiện tại
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date()) // Ngày được chọn

  // Tạo dữ liệu 144 ghế: 8 hàng (A-H), mỗi hàng 18 ghế
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
  const seatsPerRow = 18
  const seatsData = rows.map((row) => ({
    row,
    seats: Array(seatsPerRow)
      .fill(null)
      .map((_, i) => {
        const seatNumber = i + 1
        // Cố định ghế "Sold": ghế số 1-5 của mỗi hàng (A1-A5, B1-B5, ..., H1-H5)
        const isSold = seatNumber <= 5
        return {
          row,
          number: seatNumber,
          type: isSold ? "sold" : "available",
        } as Seat
      }),
  }))

  const handleSeatClick = (seat: Seat) => {
    if (seat.type === "sold") return // Không cho phép chọn ghế đã bán

    const seatId = `${seat.row}${seat.number}`
    if (selectedSeats.includes(seatId)) {
      // Bỏ chọn ghế
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId))
      setTicketCount(ticketCount - 1)
    } else {
      // Chọn ghế
      setSelectedSeats([...selectedSeats, seatId])
      setTicketCount(ticketCount + 1)
    }
  }

  // Logic lấy lịch hiện tại
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

  // Tạo danh sách 7 ngày bắt đầu từ currentWeekStart
  const getWeekDates = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart)
      date.setDate(currentWeekStart.getDate() + i)
      const day = date.getDate().toString().padStart(2, "0")
      const month = months[date.getMonth()]
      const dayOfWeek = daysOfWeek[date.getDay()]
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      const isSelected = selectedDate && isSameDay(date, selectedDate)
      dates.push({ day, month, dayOfWeek, isToday, isSelected, date })
    }
    return dates
  }

  const weekDates = getWeekDates()

  // Xử lý điều hướng lịch
  const handlePrevWeek = () => {
    const newStart = subDays(currentWeekStart, 7)
    setCurrentWeekStart(newStart)
  }

  const handleNextWeek = () => {
    const newStart = addDays(currentWeekStart, 7)
    setCurrentWeekStart(newStart)
  }

  // Xử lý chọn ngày từ danh sách
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setCurrentWeekStart(date) // Cập nhật tuần hiện tại để hiển thị ngày được chọn
  }

  return (
    <div className="mt-10 p-6 bg-gray-900 rounded-lg">
      {/* Phần chọn ngày, giờ, loại vé, địa điểm */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 items-center">
          <div className="text-gray-400">Date</div>
          <button
            onClick={handlePrevWeek}
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex gap-1">
            {weekDates.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateClick(date.date)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  date.isSelected
                    ? "bg-blue-500 text-white"
                    : date.isToday
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {date.isToday && !date.isSelected ? "Today" : date.day} <br />
                <span className="text-xs">
                  {date.month} {date.dayOfWeek}
                </span>
              </button>
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
          {/* Button mở Calendar */}
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
                  if (date) {
                    setSelectedDate(date)
                    setCurrentWeekStart(date) // Cập nhật tuần hiện tại khi chọn ngày từ calendar
                  }
                }}
                initialFocus
                className="bg-gray-800 text-white border-gray-700"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="text-gray-400">
          Time: <span className="text-white">20:00 PM</span>
        </div>
        <div className="text-gray-400">
          Type: <span className="text-white">2D</span>
        </div>
        <div className="text-gray-400">
          Address: <span className="text-white">Ocean Mall</span>
        </div>
      </div>

      {/* Phần thông tin vé và ghế */}
      <div className="flex gap-6">
        {/* Thông tin vé */}
        <div className="w-1/3 flex flex-col gap-4">
          <h3 className="text-xl font-bold">Select Your Seats</h3>
          <p className="text-gray-400">
            {ticketCount} Seats: {selectedSeats.join(", ")}
          </p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-lg font-semibold">MOVIE TICKETS</h4>
            <div className="flex justify-between text-gray-400 mt-2">
              <span>DATE & TIME</span>
              <span className="text-orange-400">
                {selectedDate
                  ? format(selectedDate, "dd/MM/yyyy")
                  : "12/07/2022"}
                , 20:00 PM
              </span>
            </div>
            <div className="flex justify-between text-gray-400 mt-2">
              <span>Tickets</span>
              <span className="text-orange-400">
                20$×{ticketCount}={20 * ticketCount}$
              </span>
            </div>
            <div className="flex justify-between text-white mt-2">
              <span>TOTAL</span>
              <span>{20 * ticketCount}$</span>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between text-gray-400">
              <span>Tickets</span>
              <span className="text-white">{ticketCount}</span>
            </div>
            <div className="flex justify-between text-gray-400 mt-2">
              <span>TYPE</span>
              <span className="text-white">2D</span>
            </div>
            <div className="flex justify-between text-white mt-2">
              <span>TOTAL PRICE</span>
              <span>{20 * ticketCount}$</span>
            </div>
          </div>
          <button className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
            BUY
          </button>
        </div>

        {/* Bản đồ ghế ngồi */}
        <div className="w-2/3">
          <div className="text-center text-gray-400 mb-4">
            <div className="border-t border-gray-500 pt-2">SCREEN</div>
          </div>
          <div className="grid gap-2">
            {seatsData.map((row) => (
              <div key={row.row} className="flex items-center gap-2">
                <span className="text-gray-400">{row.row}</span>
                <div className="flex gap-2 flex-1 justify-center">
                  {row.seats.map((seat) => {
                    const seatId = `${seat.row}${seat.number}`
                    const isSelected = selectedSeats.includes(seatId)
                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSeatClick(seat)}
                        className={`w-8 h-8 rounded-sm transition-colors ${
                          seat.type === "sold"
                            ? "bg-gray-600 cursor-not-allowed"
                            : isSelected
                            ? "bg-blue-500"
                            : "bg-gray-400"
                        }`}
                      >
                        {seat.number}
                      </button>
                    )
                  })}
                </div>
                <span className="text-gray-400">{row.row}</span>
              </div>
            ))}
          </div>
          {/* Chú thích */}
          <div className="flex justify-center gap-4 mt-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-400 rounded-sm"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
              <span>User select</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
              <span>Sold</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeatSelection
