/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface CustomDropdownProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  delay?: number
}

const CustomDropdown = ({
  label,
  value,
  onChange,
  options,
  delay = 0,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSelected, setIsSelected] = useState(false) // Theo dõi khi chọn nội dung

  // Variants cho animation của mũi tên
  const arrowVariants = {
    closed: { rotate: 0 }, // Mũi tên hướng xuống
    open: { rotate: 180 }, // Mũi tên hướng lên
  }

  // Variants cho animation scale khi chọn nội dung
  const selectVariants = {
    idle: { scale: 1 },
    selected: { scale: [1, 1.05, 1], transition: { duration: 0.3 } }, // Scale lên rồi về lại
  }

  // Reset isOpen và kích hoạt animation scale khi chọn nội dung
  const handleChange = (value: string) => {
    onChange(value)
    setIsOpen(false) // Đóng dropdown (mũi tên trở về trạng thái ban đầu)
    setIsSelected(true) // Kích hoạt animation scale
  }

  // Reset isSelected khi giá trị thay đổi
  useEffect(() => {
    setIsSelected(false)
  }, [value])

  return (
    <div className="flex items-center gap-2">
      <label className="text-gray-400 text-sm">{label}</label>
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delay }}
        variants={selectVariants}
      >
        <select
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsOpen(true)} // Khi focus (mở dropdown), set isOpen = true
          onBlur={() => setIsOpen(false)} // Khi blur (đóng dropdown), set isOpen = false
          className="appearance-none bg-transparent text-white text-sm pr-6 pl-2 py-1 focus:outline-none cursor-pointer"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-gray-800 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        <motion.div
          className="absolute right-0 top-1/4 -translate-y-1/2 pointer-events-none" // Sửa vị trí mũi tên
          variants={arrowVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="w-4 h-4 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CustomDropdown
