import { SunIcon, MoonIcon } from "lucide-react" // Giả sử dùng Lucide Icons
import { JSX } from "react"

interface CustomSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export default function CustomSwitch({
  checked,
  onCheckedChange,
}: CustomSwitchProps): JSX.Element {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only" // Ẩn input mặc định
      />
      <div
        className={`w-12 h-[1.55rem] rounded-full transition-colors duration-300 ease-in-out ${
          checked ? "bg-white" : " bg-black"
        }`}
      >
        {/* Thumb (nút trượt) */}
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-black rounded-full shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        >
          {/* Icon bên trong thumb */}
          <SunIcon
            className={`w-4 h-4 text-yellow-500 transition-opacity duration-300 ${
              checked ? "opacity-0" : "opacity-100"
            }`}
          />
          <MoonIcon
            className={`w-4 h-4 text-yellow-300 absolute transition-opacity duration-300 ${
              checked ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </label>
  )
}
