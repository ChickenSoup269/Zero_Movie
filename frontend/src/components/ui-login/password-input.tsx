import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import zxcvbn from "zxcvbn"
import { useState, useEffect } from "react"

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
  isConfirmPassword?: boolean
  disableStrengthCheck?: boolean // Thêm prop để tắt kiểm tra độ mạnh
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
  isConfirmPassword = false,
  disableStrengthCheck = false, // Mặc định là false
}: PasswordInputProps) => {
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number
    feedback: string[]
  }>({ score: 0, feedback: [] })

  useEffect(() => {
    if (value && !isConfirmPassword && !disableStrengthCheck) {
      const result = zxcvbn(value)
      const feedback: string[] = []

      if (value.length < 8) {
        feedback.push("Password must be at least 8 characters.")
      }
      if (!/[A-Z]/.test(value)) {
        feedback.push("Password must contain at least one uppercase letter.")
      }
      if (!/[a-z]/.test(value)) {
        feedback.push("Password must contain at least one lowercase letter.")
      }
      if (!/[0-9]/.test(value)) {
        feedback.push("Password must contain at least one number.")
      }
      if (!/[!@#$%^&*]/.test(value)) {
        feedback.push("Password must contain at least one special character.")
      }

      if (feedback.length === 0 && result.score < 3) {
        feedback.push(
          result.feedback.warning ||
            "Password is too weak. Try a more complex password."
        )
      }

      setPasswordStrength({ score: result.score, feedback })
    } else {
      setPasswordStrength({ score: 0, feedback: [] })
    }
  }, [value, isConfirmPassword, disableStrengthCheck])

  const strengthLabel = ["Very Weak", "Weak", "Fair", "Good", "Strong"][
    passwordStrength.score
  ]
  const strengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ][passwordStrength.score]

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

      {!isConfirmPassword && !disableStrengthCheck && value && (
        <div className="space-y-1">
          <div className="text-sm text-gray-500">
            Password Strength:{" "}
            <span
              className={
                passwordStrength.score < 3 ? "text-red-500" : "text-green-500"
              }
            >
              {strengthLabel}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${strengthColor}`}
              style={{ width: `${(passwordStrength.score + 1) * 20}%` }}
            />
          </div>
          {passwordStrength.feedback.length > 0 && (
            <ul className="text-xs text-red-500 list-disc list-inside">
              {passwordStrength.feedback.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default PasswordInput
