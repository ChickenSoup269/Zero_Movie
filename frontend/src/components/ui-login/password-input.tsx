import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

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
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void
  showPassword: boolean
  setShowPassword: (value: boolean) => void
  error?: boolean
  touched?: boolean
}

const PasswordInput = ({
  id,
  name,
  placeholder,
  value,
  onChange,
  onInput,
  showPassword,
  setShowPassword,
  error = false,
  touched = false,
}: PasswordInputProps) => {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onInput={onInput}
          className={`border ${
            error
              ? "border-red-500 placeholder:text-red-500"
              : touched
              ? "border-green-500"
              : "border-gray-300"
          } text-black bg-white placeholder-gray-400 transition-all duration-300 rounded-md focus:ring-0 focus:border-gray-500`}
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
              <EyeSlashIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </motion.div>
        </button>
      </div>
    </div>
  )
}

export default PasswordInput
