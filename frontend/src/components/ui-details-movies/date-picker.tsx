import { useState } from "react"
import { format, addDays, subDays, isSameDay, startOfWeek } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  selectedDate: Date | undefined | null
  setSelectedDate: (date: Date | undefined) => void
}

const DatePicker = ({ selectedDate, setSelectedDate }: DatePickerProps) => {
  const today = new Date()
  const [currentWeekStart, setCurrentWeekStart] = useState(today)
  const [direction, setDirection] = useState(1)

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
      const date = new Date(currentWeekStart)
      date.setDate(currentWeekStart.getDate() + i)

      const day = date.getDate().toString().padStart(2, "0")
      const month = months[date.getMonth()]
      const dayOfWeek = daysOfWeek[date.getDay()]
      const isToday = isSameDay(date, today)
      const isSunday = date.getDay() === 0
      const isSelected = selectedDate && isSameDay(date, selectedDate)
      dates.push({ day, month, dayOfWeek, isToday, isSunday, isSelected, date })
    }
    return dates
  }

  const weekDates = getWeekDates()

  const handlePrevWeek = () => {
    const newStart = subDays(currentWeekStart, 7)
    const todayStartOfWeek = startOfWeek(today, { weekStartsOn: 1 })
    if (newStart >= todayStartOfWeek) {
      setDirection(-1)
      setCurrentWeekStart(newStart)
      setSelectedDate(undefined) // Reset ngày chọn khi chuyển tuần
    }
  }

  const handleNextWeek = () => {
    const newStart = addDays(currentWeekStart, 7)
    setDirection(1)
    setCurrentWeekStart(newStart)
    setSelectedDate(undefined) // Reset ngày chọn khi chuyển tuần
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date && date >= today) {
      setSelectedDate(date)
      const newWeekStart = startOfWeek(date, { weekStartsOn: 1 })
      if (newWeekStart < today) {
        setCurrentWeekStart(today)
      } else {
        setDirection(1)
        setCurrentWeekStart(newWeekStart)
      }
    }
  }

  // Variants cho animation
  const variants = {
    enter: {
      y: -50,
      opacity: 0,
      position: "absolute" as const,
    },
    center: {
      y: 0,
      opacity: 1,
      position: "relative" as const,
    },
    exit: {
      y: 0,
      opacity: 0,
      position: "absolute" as const,
    },
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="text-gray-400">Date:</div>
      <button
        onClick={handlePrevWeek}
        className={`text-orange-500 hover:text-orange-400 ${
          isSameDay(currentWeekStart, startOfWeek(today, { weekStartsOn: 1 }))
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
        disabled={isSameDay(
          currentWeekStart,
          startOfWeek(today, { weekStartsOn: 1 })
        )}
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
      <div className="flex gap-1 overflow-hidden relative min-h-[80px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentWeekStart.toISOString()}
            className="flex gap-1"
            custom={direction > 0 ? "enter" : "exit"}
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              staggerChildren: 0.05,
            }}
          >
            {weekDates.map((date, index) => (
              <motion.button
                key={index}
                onClick={() => handleDateClick(date.date)}
                variants={{
                  enter: { opacity: 0, y: 20 },
                  center: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -20 },
                }}
                className={`px-3 py-3 rounded-xl text-sm font-medium flex flex-col items-center justify-center ${
                  date.isSelected
                    ? "bg-[#4599e3] text-white"
                    : date.isToday
                    ? "bg-white text-[#4599e3]"
                    : date.isSunday
                    ? "text-red-500 bg-gray-700"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
                transition={{
                  duration: 0.1,
                  delay: index * 0.04,
                }}
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-xs">{date.month}</span>
                <span className="text-base font-bold">{date.day}</span>
                <span className="text-xs">{date.dayOfWeek}</span>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <button
        onClick={handleNextWeek}
        className="text-orange-500 hover:text-orange-400"
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
            onSelect={handleCalendarSelect}
            disabled={(date) => date < today}
            initialFocus
            className="bg-gray-800 text-white border-gray-700"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatePicker
