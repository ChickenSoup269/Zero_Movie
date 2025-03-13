"use client"
import { useState, useEffect } from "react"
import { SunIcon, MoonIcon } from "lucide-react"
import { JSX } from "react"

interface CustomSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export default function CustomSwitch({
  checked,
  onCheckedChange,
}: CustomSwitchProps): JSX.Element {
  // Khởi tạo với prop checked, không truy cập localStorage ngay
  const [isChecked, setIsChecked] = useState(checked)

  // Đồng bộ với localStorage sau khi mount
  useEffect(() => {
    // Chỉ chạy trên client
    const saved = localStorage.getItem("darkMode")
    if (saved !== null) {
      const savedValue = JSON.parse(saved)
      setIsChecked(savedValue)
      onCheckedChange(savedValue) // Đồng bộ với parent ngay lập tức
    }
  }, [onCheckedChange]) // Chạy một lần khi mount

  // Đồng bộ với prop checked từ parent
  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  // Xử lý khi toggle
  const handleToggle = (newChecked: boolean) => {
    setIsChecked(newChecked)
    onCheckedChange(newChecked)
    localStorage.setItem("darkMode", JSON.stringify(newChecked))
  }

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => handleToggle(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`w-12 h-6 rounded-full transition-colors duration-300 ease-in-out shadow-md ${
          isChecked ? "bg-[#4599e3] " : " bg-white"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
            isChecked ? "translate-x-5" : "translate-x-1"
          }`}
        >
          <SunIcon
            className={`w-4 h-4 text-[#4599e3] transition-opacity duration-300 ${
              isChecked ? "opacity-0" : "opacity-100"
            }`}
          />
          <MoonIcon
            className={`w-4 h-4 text-white absolute transition-opacity duration-300 ${
              isChecked ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </label>
  )
}
