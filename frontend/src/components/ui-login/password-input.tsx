import { motion } from "framer-motion" // Đảm bảo import framer-motion
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

// Variants cho animation của container chính
const containerVariants = {
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  toggle: {
    scale: [1, 1.02, 1], // Hiệu ứng scale nhẹ (phóng to rồi thu nhỏ lại)
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
}

// Variants cho animation của biểu tượng
const iconVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  exit: { opacity: 0, scale: 0.8 },
}

interface PasswordInputProps {
  id: string
  name: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  showPassword: boolean
  setShowPassword: (value: boolean) => void
}

const PasswordInput = ({
  id,
  name,
  placeholder,
  value,
  onChange,
  showPassword,
  setShowPassword,
}: PasswordInputProps) => {
  return (
    <motion.div
      className="space-y-2"
      variants={containerVariants}
      initial="visible"
      animate="toggle" // Kích hoạt animation mỗi khi showPassword thay đổi
      key={showPassword ? "visible" : "hidden"} // Key để kích hoạt animation
    >
      <Label htmlFor={id} className="text-black">
        {name === "confirmPassword" ? "Confirm Password" : "Password"}
      </Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          className="border-black text-black bg-white placeholder-gray-400"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => setShowPassword(!showPassword)}
        >
          <motion.div
            key={showPassword ? "eye-slash" : "eye"}
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-black" />
            ) : (
              <EyeIcon className="h-5 w-5 text-black" />
            )}
          </motion.div>
        </button>
      </div>
    </motion.div>
  )
}

export default PasswordInput
